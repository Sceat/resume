<template>
  <div ref="rootRef" class="hero-shader" aria-hidden="true">
    <canvas ref="canvasRef" class="hero-shader__canvas" />
    <div class="hero-shader__grade" />
  </div>
</template>

<script setup>
import { Program, Mesh, Renderer, Triangle } from 'ogl'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { usePrefersReducedMotion } from '../composables/use-prefers-reduced-motion.js'

const props = defineProps({
  mouseX: { type: Number, default: 0.5 },
  mouseY: { type: Number, default: 0.5 },
})

/**
 * Hero shader v7 — ambient curl-noise field.
 *
 *  Two auto-drifting splats give the field its own life. The cursor never
 *  guides the field — it merely warps a small region around itself when
 *  you move fast (think: heat-distortion, not magnet). The field is the
 *  protagonist; the cursor is a passing influence.
 *
 *  Removed in this version (vs v6):
 *   • Cursor-following splat
 *   • Bright halo at cursor
 *   • Radial ripple on fast moves
 *
 *  Single fragment-shader pass over a Triangle, no FBOs. ~1.2ms M1.
 */

const reduced = usePrefersReducedMotion()

const rootRef = ref(null)
const canvasRef = ref(null)

let renderer = null
let program = null
let mesh = null
let raf = 0
let startTs = 0
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
let inView = true
let observer = null
let resizeObserver = null

const targetMouse = [0.5, 0.5]
const currentMouse = [0.5, 0.5]
let lastMouse = [0.5, 0.5]
let velocity = 0

const VERT = /* glsl */ `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uMouse;        // lerped cursor (UV 0..1, GL-flipped Y)
uniform float uVelocity;     // smoothed cursor speed (0..1.5)
uniform vec3  uColorA;
uniform vec3  uColorB;
uniform vec3  uColorC;
uniform float uDensity;
uniform float uSimple;

varying vec2 vUv;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
}

vec2 curl(vec2 p, float t) {
  float e = 0.05;
  float n1 = vnoise(p + vec2(e, 0.0) + t);
  float n2 = vnoise(p - vec2(e, 0.0) + t);
  float n3 = vnoise(p + vec2(0.0, e) + t);
  float n4 = vnoise(p - vec2(0.0, e) + t);
  return vec2(n3 - n4, -(n1 - n2)) / (2.0 * e);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  // Cursor in aspect-space (used only for a tiny local warp, not as a guide)
  vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0);
  vec2 d = p - m;
  float dist = length(d);

  // ── Subtle warp around cursor ─────────────────────────────────────────
  // Tiny radial pull — barely visible, only on fast moves. The cursor
  // is a passing breeze, not a magnet. Tops out around 0.07.
  float warpStrength = 0.022 + uVelocity * 0.05;
  float warp = warpStrength * exp(-dist * 4.0);
  vec2 warpDir = normalize(d + 0.0001);

  // ── Curl flow field (idle motion that never freezes) ──────────────────
  vec2 flow;
  if (uSimple > 0.5) {
    flow = vec2(
      vnoise(p * 1.6 + uTime * 0.06),
      vnoise(p * 1.6 + uTime * 0.06 + 9.31)
    );
  } else {
    flow = curl(p * 1.4 + vec2(uTime * 0.05, 0.0), uTime * 0.025);
    flow += 0.5 * curl(p * 3.1 - vec2(0.0, uTime * 0.04), uTime * 0.06);
    // Velocity nudges turbulence very slightly — felt, not seen as motion.
    flow *= 1.0 + uVelocity * 0.18;
  }

  // ── Final UV — flow + tiny warp ───────────────────────────────────────
  vec2 q = p + flow * 0.075 + warpDir * warp;

  // ── Two auto-drifting splats — the field has its own life ────────────
  float t = uTime * 0.18;
  vec2 c1 = vec2(sin(t * 0.7) * 0.50, cos(t * 0.5) * 0.30);
  vec2 c2 = vec2(cos(t * 0.6 + 1.7) * 0.42, sin(t * 0.85 + 0.6) * 0.34);

  float r1 = length(q - c1);
  float r2 = length(q - c2);

  // Steeper falloff = smaller hot core, dimmer edges → calmer overall.
  float a1 = exp(-r1 * 2.7);
  float a2 = exp(-r2 * 2.85);

  // ── Compose colors — calmer, atmospheric ─────────────────────────────
  vec3 col = uColorA * a1
           + uColorB * a2
           + uColorC * (a1 * a2) * 0.4;

  // grain via fine noise
  float grain = vnoise(uv * uResolution.xy * 0.12 + uTime * 0.6) * 0.05;
  col += grain * 0.35;

  // alpha — present but no longer overwhelming
  float alpha = (a1 * 0.55 + a2 * 0.55) * uDensity;

  gl_FragColor = vec4(col, alpha);
}
`

const readCssColor = (varName, fallback) => {
  if (typeof window === 'undefined') return fallback
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim()
  if (!raw) return fallback
  let hex = raw.replace('#', '')
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('')
  if (hex.length !== 6) return fallback
  const n = parseInt(hex, 16)
  return [(n >> 16 & 0xff) / 255, (n >> 8 & 0xff) / 255, (n & 0xff) / 255]
}

const handleResize = () => {
  if (!renderer || !rootRef.value || !canvasRef.value) return
  const rect = rootRef.value.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return
  renderer.setSize(rect.width, rect.height)
  if (program) {
    program.uniforms.uResolution.value = [
      canvasRef.value.width,
      canvasRef.value.height,
    ]
  }
}

watch(
  () => [props.mouseX, props.mouseY],
  ([mx, my]) => {
    targetMouse[0] = mx
    targetMouse[1] = 1.0 - my
  },
)

const tick = (ts) => {
  raf = 0
  if (!renderer || !program || !mesh) return
  if (!startTs) startTs = ts
  const elapsed = (ts - startTs) / 1000

  currentMouse[0] += (targetMouse[0] - currentMouse[0]) * 0.10
  currentMouse[1] += (targetMouse[1] - currentMouse[1]) * 0.10

  const dx = currentMouse[0] - lastMouse[0]
  const dy = currentMouse[1] - lastMouse[1]
  const instSpeed = Math.hypot(dx, dy)
  velocity += (instSpeed - velocity) * 0.18
  if (velocity < 0.0005) velocity = 0
  lastMouse = [currentMouse[0], currentMouse[1]]

  program.uniforms.uTime.value = elapsed
  program.uniforms.uMouse.value = [currentMouse[0], currentMouse[1]]
  // Amplified for shader use, then clamped — keeps the warp subtle.
  program.uniforms.uVelocity.value = Math.min(velocity * 8.0, 0.7)

  renderer.render({ scene: mesh })

  if (!reduced.value && inView && !document.hidden) {
    raf = requestAnimationFrame(tick)
  }
}

const kick = () => {
  if (!raf && !reduced.value && inView && !document.hidden) {
    raf = requestAnimationFrame(tick)
  }
}

const onVisibility = () => {
  if (document.hidden) {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  } else {
    kick()
  }
}

onMounted(() => {
  if (typeof window === 'undefined' || !canvasRef.value) return

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

  try {
    renderer = new Renderer({
      canvas: canvasRef.value,
      dpr,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: 'low-power',
      antialias: false,
    })
  } catch {
    renderer = null
    return
  }

  const { gl } = renderer
  gl.clearColor(0, 0, 0, 0)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  const colorA = readCssColor('--color-primary', [0.376, 0.647, 0.98])
  const colorB = readCssColor('--color-secondary', [0.506, 0.549, 0.973])
  const colorC = readCssColor('--color-primary-glow', [0.576, 0.769, 0.99])

  const geometry = new Triangle(gl)

  program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: [1, 1] },
      uMouse: { value: [0.5, 0.5] },
      uVelocity: { value: 0 },
      uColorA: { value: colorA },
      uColorB: { value: colorB },
      uColorC: { value: colorC },
      // Present but calm — field reads as atmospheric haze, not stage lights.
      uDensity: { value: isMobile ? 0.55 : 0.80 },
      uSimple: { value: isMobile ? 1 : 0 },
    },
    transparent: true,
  })

  mesh = new Mesh(gl, { geometry, program })

  handleResize()
  requestAnimationFrame(() => {
    handleResize()
    if (renderer && mesh) renderer.render({ scene: mesh })
  })
  renderer.render({ scene: mesh })

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => handleResize())
    resizeObserver.observe(rootRef.value)
  } else {
    window.addEventListener('resize', handleResize, { passive: true })
  }

  if (typeof IntersectionObserver !== 'undefined' && rootRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          inView = entry.isIntersecting
          if (inView) kick()
        }
      },
      { threshold: 0.01 },
    )
    observer.observe(rootRef.value)
  }

  document.addEventListener('visibilitychange', onVisibility)

  if (!reduced.value) kick()
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
  if (observer) observer.disconnect()
  observer = null
  if (resizeObserver) resizeObserver.disconnect()
  else window.removeEventListener('resize', handleResize)
  resizeObserver = null
  document.removeEventListener('visibilitychange', onVisibility)
  if (renderer && renderer.gl) {
    const ext = renderer.gl.getExtension('WEBGL_lose_context')
    if (ext) ext.loseContext()
  }
  renderer = null
  program = null
  mesh = null
})
</script>

<style scoped>
.hero-shader {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  contain: layout paint;
  z-index: -10;
}

.hero-shader__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}

.hero-shader__grade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(
    to bottom,
    rgba(96, 165, 250, 0.018) 0px,
    rgba(96, 165, 250, 0.018) 1px,
    transparent 1px,
    transparent 4px
  );
  opacity: 0.5;
  mix-blend-mode: screen;
}

@media (max-width: 767px) {
  .hero-shader__grade { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-shader__grade { mix-blend-mode: normal; opacity: 0.4; }
}
</style>
