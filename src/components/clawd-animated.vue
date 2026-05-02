<template>
  <div
    ref="containerRef"
    class="clawd-animated"
    :style="rootStyle"
    aria-hidden="true"
    v-html="svgMarkup"
  />
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import svgMarkup from '../assets/mascot/clawd-exercise.svg?raw'
import { usePrefersReducedMotion } from '../composables/use-prefers-reduced-motion.js'

/**
 * Animated Clawd mascot, inline-rendered + JS-driven frame timeline.
 *
 * The SVG is the actual exercising mascot extracted from ayotomcs.me/claude-mascot
 * (36 top-level <g> frames). The timeline + sequence array is ported verbatim from
 * Ayotomiwa's compiled Next.js chunk:
 *
 *   sequence: [0..24, 13..24, 25..35]   // 48 steps
 *   durations: 0.085s default
 *              0.27s for frames 6 or 7
 *               0.4s for frames 15 or 21
 *               1.5s for final step (rest)
 *
 * Only one <g> is display:inline at any moment; rAF picks the right frame
 * based on elapsed time modulo the total cycle length.
 */
const props = defineProps({
  size: { type: Number, default: 280 },
})

const containerRef = ref(null)
const reduced = usePrefersReducedMotion()

const rootStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}))

// ── Frame sequence + durations (from ayotomcs.me chunk b49c2a4d) ───────────
const SEQUENCE = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
]

function durationForStep(stepIdx, frameIdx) {
  if (stepIdx === SEQUENCE.length - 1) return 1.5
  if (frameIdx === 6 || frameIdx === 7) return 0.27
  if (frameIdx === 15 || frameIdx === 21) return 0.4
  return 0.085
}

let raf = 0
let observer = null
let isVisible = true
let currentFrame = -1
let groups = []
let timeline = []
let totalDuration = 0
let startTime = 0

function buildTimeline() {
  timeline = []
  let cumulative = 0
  for (let s = 0; s < SEQUENCE.length; s++) {
    const fi = SEQUENCE[s]
    timeline.push({ time: cumulative, frameIdx: fi })
    cumulative += durationForStep(s, fi)
  }
  totalDuration = cumulative
}

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
  const elapsed = ((performance.now() - startTime) / 1000) % totalDuration
  // Linear scan is fine — only 48 steps
  let active = timeline[0].frameIdx
  for (let i = 0; i < timeline.length; i++) {
    if (timeline[i].time <= elapsed) active = timeline[i].frameIdx
    else break
  }
  showOnly(active)
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  if (!containerRef.value) return
  const svg = containerRef.value.querySelector('svg')
  if (!svg) return

  // Make the SVG fill the container
  svg.removeAttribute('class')
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', '100%')
  svg.style.display = 'block'
  svg.style.shapeRendering = 'crispEdges'

  groups = Array.from(svg.children).filter(
    (c) => c.tagName && c.tagName.toLowerCase() === 'g',
  )
  if (groups.length < 36) {
    // SVG isn't the expected one — fail soft, leave it as-is
    return
  }

  // Hide every frame, show only frame 0 to start
  groups.forEach((g) => {
    g.style.display = 'none'
  })
  showOnly(SEQUENCE[0])

  if (reduced.value) {
    // Static — no animation, just freeze on the celebrate-ready frame (24)
    showOnly(24)
    return
  }

  buildTimeline()
  startTime = performance.now()

  // Pause when offscreen
  if (typeof IntersectionObserver !== 'undefined') {
    observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const wasVisible = isVisible
        isVisible = e.isIntersecting
        if (isVisible && !wasVisible) {
          // Re-anchor time so resumes feel continuous
          startTime = performance.now() - currentFrame * 0
          if (!raf) raf = requestAnimationFrame(tick)
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
.clawd-animated {
  display: inline-block;
  position: relative;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}

.clawd-animated :deep(svg) {
  width: 100% !important;
  height: 100% !important;
  display: block;
  shape-rendering: crispEdges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
</style>
