<template>
  <div
    ref="containerRef"
    class="mascot-flag"
    :style="rootStyle"
    aria-hidden="true"
    v-html="svgMarkup"
  />
</template>

<script setup>
import gsap from 'gsap'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import svgMarkup from '../assets/mascot/clawd-flag.svg?raw'
import { usePrefersReducedMotion } from '../composables/use-prefers-reduced-motion.js'

/**
 * Animated Clawd holding a flag — same SVG and same library (GSAP) as
 * ayotomcs.me/claude-mascot. Animation parameters were captured by
 * sampling the source DOM at 100 ms intervals while GSAP ran:
 *
 *   - Outer wrapper x cycles between { 4, 0, -5, -5, 0 } (~600 ms)
 *   - Inner wrapper x cycles between { 0, -10, -16, -18, -8, -2 } (~600 ms)
 *   - Visible frame cycles through 12 sub-frames at ~100 ms each (~1.2 s)
 *
 * SVG structure (depth from <svg>):
 *   svg > rect.dleg, .dleg_2..4 (always-on back legs)
 *       > g[data-svg-origin="0 0"]                  ← outer wrapper
 *           > g#Group45 (static body part)
 *           > g#Group46 (static body part)
 *           > g[data-svg-origin="92 0"]             ← inner wrapper
 *               > g[display:inline] (default frame)
 *               > g[display:none] × 11 (hidden frames)
 */

const props = defineProps({
  size: { type: Number, default: 56 },
})

const containerRef = ref(null)
const reduced = usePrefersReducedMotion()

const rootStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}))

const OUTER_X_CYCLE = [4, 0, -5, -5, 0]
const INNER_X_CYCLE = [0, -10, -16, -18, -8, -2]
const STEP_DURATION_S = 0.12
const FRAME_DURATION_MS = 100

let outerTl = null
let innerTl = null
let frameTimer = 0

let allFrames = []
let defaultFrame = null
let frameOrder = []
let frameStep = 0

function showFrame(frame) {
  for (const f of allFrames) f.style.display = 'none'
  if (frame) frame.style.display = 'inline'
}

onMounted(() => {
  if (!containerRef.value) return
  const svg = containerRef.value.querySelector('svg')
  if (!svg) return

  svg.removeAttribute('class')
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', '100%')
  svg.style.display = 'block'
  svg.style.shapeRendering = 'crispEdges'

  // outer wrapper = top-level <g> (data-svg-origin="0 0")
  const outerG = Array.from(svg.children).find(
    (c) => c.tagName?.toLowerCase() === 'g',
  )
  if (!outerG) return

  // inner wrapper = the <g> with data-svg-origin="92 0" (Group 45/46
  // are visible body parts, NOT the GSAP-animated wrapper)
  const innerG = Array.from(outerG.children).find(
    (c) =>
      c.tagName?.toLowerCase() === 'g' &&
      c.getAttribute('data-svg-origin') === '92 0',
  )
  if (!innerG) return

  // 12 frames inside innerG: 1 default-visible + 11 hidden
  allFrames = Array.from(innerG.children).filter(
    (c) => c.tagName?.toLowerCase() === 'g',
  )
  defaultFrame = allFrames.find((g) => g.style.display !== 'none')
  if (!allFrames.length) return

  // Cycle order: default first, then all other frames in DOM order.
  // Source toggles one frame at a time — DOM order gives a coherent walk.
  frameOrder = [defaultFrame, ...allFrames.filter((g) => g !== defaultFrame)]

  if (reduced.value) {
    showFrame(defaultFrame)
    return
  }

  // Frame toggle — vanilla setInterval, simpler than gsap.call().
  showFrame(frameOrder[0])
  frameTimer = window.setInterval(() => {
    frameStep = (frameStep + 1) % frameOrder.length
    showFrame(frameOrder[frameStep])
  }, FRAME_DURATION_MS)

  // Outer + inner X tweens via GSAP — sine.inOut for smooth body motion.
  // We mutate the `transform` attribute directly each frame (proxy object
  // holds the numeric x; onUpdate writes the matrix string).
  const outerProxy = { x: OUTER_X_CYCLE[0] }
  const innerProxy = { x: INNER_X_CYCLE[0] }

  outerTl = gsap.timeline({ repeat: -1 })
  for (let i = 0; i < OUTER_X_CYCLE.length; i++) {
    const next = OUTER_X_CYCLE[(i + 1) % OUTER_X_CYCLE.length]
    outerTl.to(outerProxy, {
      x: next,
      duration: STEP_DURATION_S,
      ease: 'sine.inOut',
      onUpdate: () =>
        outerG.setAttribute(
          'transform',
          `matrix(1,0,0,1,${outerProxy.x.toFixed(2)},0)`,
        ),
    })
  }

  innerTl = gsap.timeline({ repeat: -1 })
  for (let i = 0; i < INNER_X_CYCLE.length; i++) {
    const next = INNER_X_CYCLE[(i + 1) % INNER_X_CYCLE.length]
    innerTl.to(innerProxy, {
      x: next,
      duration: STEP_DURATION_S,
      ease: 'sine.inOut',
      onUpdate: () =>
        innerG.setAttribute(
          'transform',
          `matrix(1,0,0,1,${innerProxy.x.toFixed(2)},0)`,
        ),
    })
  }
})

onBeforeUnmount(() => {
  if (outerTl) outerTl.kill()
  if (innerTl) innerTl.kill()
  if (frameTimer) window.clearInterval(frameTimer)
})
</script>

<style scoped>
.mascot-flag {
  display: inline-block;
  position: relative;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}

.mascot-flag :deep(svg) {
  width: 100% !important;
  height: 100% !important;
  display: block;
  shape-rendering: crispEdges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  overflow: visible;
}
</style>
