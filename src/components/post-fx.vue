<template>
  <canvas
    ref="canvasRef"
    class="post-fx"
    aria-hidden="true"
  />
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { usePrefersReducedMotion } from '../composables/use-prefers-reduced-motion.js'

/**
 * Global post-processing overlay.
 *
 * A fullscreen WebGL canvas that paints a unified film-grain + Bayer-dither
 * + vignette pass over the entire page. Blended via mix-blend-mode: overlay
 * so every layer underneath (terminal chrome, hero shader, mascot, sections)
 * shares ONE lighting model — kills the "WordPress islands" feel.
 *
 * Z-index sits above chrome (60) and below modals (80).
 */
const canvasRef = ref(null)
const reduced = usePrefersReducedMotion()

let gl = null
let program = null
let uTime = null
let uRes = null
let raf = 0
let lastT = 0

const VERT = `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`

// Bayer 4x4 dithering + hash-based film grain + radial vignette.
// Output is grayscale centered around 0.5 so mix-blend-mode: overlay reads
// it as "neutral with subtle deviations" — small darkenings/brightenings
// applied per-pixel that unify all underlying layers.
const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform float u_time;
uniform vec2 u_resolution;

float bayer4(vec2 p) {
  int x = int(mod(p.x, 4.0));
  int y = int(mod(p.y, 4.0));
  int i = x + y * 4;
  // Bayer 4x4 matrix as a switch
  if (i == 0)  return  0.0/16.0;
  if (i == 1)  return  8.0/16.0;
  if (i == 2)  return  2.0/16.0;
  if (i == 3)  return 10.0/16.0;
  if (i == 4)  return 12.0/16.0;
  if (i == 5)  return  4.0/16.0;
  if (i == 6)  return 14.0/16.0;
  if (i == 7)  return  6.0/16.0;
  if (i == 8)  return  3.0/16.0;
  if (i == 9)  return 11.0/16.0;
  if (i == 10) return  1.0/16.0;
  if (i == 11) return  9.0/16.0;
  if (i == 12) return 15.0/16.0;
  if (i == 13) return  7.0/16.0;
  if (i == 14) return 13.0/16.0;
  return 5.0/16.0;
}

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p  = gl_FragCoord.xy;

  // Bayer dithering — 8% intensity, centered around 0.5
  float d = (bayer4(floor(p)) - 0.5) * 0.08;

  // Animated film grain — 4% intensity, time-jitter the hash seed
  float g = (hash21(p + u_time * 60.0) - 0.5) * 0.04;

  // Vignette — soft darkening at edges (multiply via overlay)
  float r   = length(uv - 0.5) * 1.42;
  float vig = smoothstep(1.0, 0.45, r);     // 1 at center, 0 at corner
  float v   = (vig - 1.0) * 0.10;            // negative offset at edges only

  // Combine — gray output centered on 0.5, mix-blend-mode: overlay reads
  // 0.5 as neutral so the pass adds tiny darkenings/brightenings only.
  float c = 0.5 + d + g + v;

  fragColor = vec4(vec3(c), 1.0);
}`

function compile(src, type) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    // eslint-disable-next-line no-console
    console.warn('[post-fx] shader compile failed', gl.getShaderInfoLog(s))
    gl.deleteShader(s)
    return null
  }
  return s
}

function resize() {
  if (!canvasRef.value || !gl) return
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  const w = Math.floor(window.innerWidth * dpr)
  const h = Math.floor(window.innerHeight * dpr)
  if (canvasRef.value.width !== w || canvasRef.value.height !== h) {
    canvasRef.value.width = w
    canvasRef.value.height = h
    gl.viewport(0, 0, w, h)
  }
}

function tick(t) {
  raf = 0
  if (!gl || !program) return
  resize()
  if (uTime) gl.uniform1f(uTime, (t || 0) * 0.001)
  if (uRes) gl.uniform2f(uRes, canvasRef.value.width, canvasRef.value.height)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  if (!reduced.value && !document.hidden) {
    raf = requestAnimationFrame(tick)
  }
}

function init() {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: false,
    antialias: false,
    depth: false,
    stencil: false,
  })
  if (!ctx) {
    // No WebGL2 — silently no-op (chrome falls back to no post-fx)
    return
  }
  gl = ctx

  const vs = compile(VERT, gl.VERTEX_SHADER)
  const fs = compile(FRAG, gl.FRAGMENT_SHADER)
  if (!vs || !fs) return

  program = gl.createProgram()
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    // eslint-disable-next-line no-console
    console.warn('[post-fx] link failed', gl.getProgramInfoLog(program))
    return
  }
  gl.useProgram(program)

  // Fullscreen quad
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  )
  const aPos = gl.getAttribLocation(program, 'a_pos')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

  uTime = gl.getUniformLocation(program, 'u_time')
  uRes = gl.getUniformLocation(program, 'u_resolution')

  resize()
  if (reduced.value) {
    // Render one static frame and stop
    tick(0)
  } else {
    raf = requestAnimationFrame(tick)
  }
}

function onResize() {
  if (!gl) return
  resize()
  if (reduced.value) tick(lastT) // re-render the static frame at new size
}

function onVisibility() {
  if (document.hidden) {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  } else if (!reduced.value && !raf) {
    raf = requestAnimationFrame(tick)
  }
}

onMounted(() => {
  init()
  window.addEventListener('resize', onResize, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  document.removeEventListener('visibilitychange', onVisibility)
  if (raf) cancelAnimationFrame(raf)
  raf = 0
  gl = null
  program = null
})
</script>

<style scoped>
.post-fx {
  position: fixed;
  inset: 0;
  z-index: 70;
  pointer-events: none;
  width: 100vw;
  height: 100vh;
  /* Overlay blend: 0.5 = neutral, deviations darken/brighten the pixel below */
  mix-blend-mode: overlay;
  /* Tone down the overall effect so it's atmospheric, not crushing */
  opacity: 0.55;
}

@media (prefers-reduced-motion: reduce) {
  .post-fx {
    /* Reduced motion: keep the static dither + vignette but no animated grain.
       Component rAF loop already terminates after one frame in this case. */
    opacity: 0.4;
  }
}
</style>
