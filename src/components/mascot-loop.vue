<template>
  <div
    ref="containerRef"
    class="mascot-loop"
    :style="rootStyle"
    aria-hidden="true"
    v-html="svgMarkup"
  />
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { usePrefersReducedMotion } from '../composables/use-prefers-reduced-motion.js'

/**
 * Generic frame-loop SVG mascot.
 *
 * Many of Ayotomiwa's Claude mascots are encoded as N stacked top-level <g>
 * frames with `display: none`. The animation toggles `display: inline` on
 * exactly one frame at a time. This component drives that toggle from rAF.
 *
 * Caller passes:
 *   - svgMarkup     : raw SVG string (?raw import)
 *   - frameCount    : number of top-level <g> children to cycle
 *   - frameDuration : seconds per frame (default 0.1)
 *   - size          : square size in px
 *   - startFrame    : optional, for visual stagger across instances
 */
const props = defineProps({
  svgMarkup: { type: String, required: true },
  frameCount: { type: Number, required: true },
  frameDuration: { type: Number, default: 0.1 },
  size: { type: Number, default: 64 },
  startFrame: { type: Number, default: 0 },
})

const containerRef = ref(null)
const reduced = usePrefersReducedMotion()

const rootStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}))

let raf = 0
let observer = null
let isVisible = true
let currentFrame = -1
let groups = []
let startTime = 0

function showOnly(idx) {
  if (idx === currentFrame) return
  if (currentFrame >= 0 && groups[currentFrame]) {
    groups[currentFrame].style.display = 'none'
  }
  if (groups[idx]) {
    groups[idx].style.display = 'inline'
  }
  currentFrame = idx
}

function tick() {
  if (!isVisible) {
    raf = 0
    return
  }
  const elapsed = (performance.now() - startTime) / 1000
  const frame = Math.floor(elapsed / props.frameDuration) % props.frameCount
  showOnly(frame)
  raf = requestAnimationFrame(tick)
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

  groups = Array.from(svg.children).filter(
    (c) => c.tagName && c.tagName.toLowerCase() === 'g',
  )
  if (groups.length < props.frameCount) {
    return
  }

  groups.forEach((g) => {
    g.style.display = 'none'
  })
  showOnly(props.startFrame % props.frameCount)

  if (reduced.value) {
    return
  }

  // Stagger via startTime so multiple instances don't lockstep
  startTime = performance.now() - props.startFrame * props.frameDuration * 1000

  if (typeof IntersectionObserver !== 'undefined') {
    observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const wasVisible = isVisible
        isVisible = e.isIntersecting
        if (isVisible && !wasVisible && !raf) {
          raf = requestAnimationFrame(tick)
        }
      }
    })
    observer.observe(containerRef.value)
  }

  raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.mascot-loop {
  display: inline-block;
  position: relative;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}

.mascot-loop :deep(svg) {
  width: 100% !important;
  height: 100% !important;
  display: block;
  shape-rendering: crispEdges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
</style>
