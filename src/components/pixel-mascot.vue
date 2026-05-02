<template>
  <div
    ref="rootRef"
    :class="[
      'pixel-mascot',
      `is-state-${state}`,
      reduced ? 'is-reduced' : '',
      floating ? 'is-floating' : '',
      isIntersecting ? '' : 'is-paused',
    ]"
    :style="rootStyle"
    :aria-label="ariaLabel"
    role="img"
  />
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import spriteUrl from '../assets/mascot/clawd-sprite.png'
import { usePrefersReducedMotion } from '../composables/use-prefers-reduced-motion.js'

/**
 * Pixel Mascot - sprite-sheet animated Clawd from Anthropic's Claude.
 *
 * Sprite sheet layout (`src/assets/mascot/clawd-sprite.png`):
 *   - Dimensions: 640x80 (8 frames, single row)
 *   - Frame size:  80x80 native
 *   - Source:      msct04.webm (1920x1080 30fps), cropped 320x320 around the
 *                  mascot, point-filtered to 80x80, transparent background
 *                  (fuzz 6% on srgb(225,217,203)), PNG8 quantized to 16 colors.
 *   - File size:   ~1.4 KB
 *
 * Frame index map:
 *   0 - idle stand (legs visible)
 *   1 - idle stand (alt - subtle variation)
 *   2 - squash crouch (no legs, body lowered)
 *   3 - squash crouch (alt)
 *   4 - head right + confetti right
 *   5 - head right + confetti right (alt)
 *   6 - head left  + confetti left
 *   7 - head left  + confetti left  (alt)
 *
 * State -> frame range:
 *   idle    -> 0..3 (4 frames, 1200ms, calm breathe/squash, no confetti)
 *   walk    -> 0..7 (8 frames,  800ms, full celebration hop)
 *   working -> 2..7 (6 frames,  700ms, squash + confetti shooting)
 *
 * Pixel-precise rendering via image-rendering: pixelated and integer scaling.
 * For maximum crispness at 1x DPR use multiples of 16; multiples of 8 stay
 * crisp at 2x DPR. Other sizes still render but may show minor aliasing.
 * No drop-shadow / glow - pure pixel art.
 * IntersectionObserver pauses animation off-screen (CPU hygiene).
 * prefers-reduced-motion -> freezes on first frame.
 */

const FRAME_PX = 80
const SHEET_FRAMES = 8

const props = defineProps({
  state: {
    type: String,
    default: 'idle',
    validator: (v) => ['idle', 'walk', 'working'].includes(v),
  },
  size: {
    type: Number,
    default: 64,
    // Any positive integer is allowed. Multiples of 16 are crispest at 1x DPR;
    // multiples of 8 stay crisp at 2x DPR. Sub-multiple sizes (e.g. 40, 56)
    // still render via image-rendering: pixelated but may show slight aliasing
    // on the source pixel grid.
    validator: (v) => Number.isFinite(v) && v > 0,
  },
  floating: { type: Boolean, default: true },
})

const rootRef = ref(null)
const reduced = usePrefersReducedMotion()
const isIntersecting = ref(true)

const rootStyle = computed(() => {
  const sheetWidth = props.size * SHEET_FRAMES
  return {
    width: `${props.size}px`,
    height: `${props.size}px`,
    backgroundImage: `url(${spriteUrl})`,
    backgroundSize: `${sheetWidth}px ${props.size}px`,
    backgroundRepeat: 'no-repeat',
    // CSS variables drive the keyframe end positions in absolute pixels,
    // so the animation works regardless of `size` prop.
    '--frame-size': `${props.size}px`,
    '--frame-2': `${-2 * props.size}px`,
    '--frame-4': `${-4 * props.size}px`,
    '--frame-8': `${-8 * props.size}px`,
  }
})

const ariaLabel = computed(() => {
  switch (props.state) {
    case 'walk':
      return 'Mascot Clawd celebrating - pixel art animation'
    case 'working':
      return 'Mascot Clawd working - pixel art animation'
    default:
      return 'Mascot Clawd idle - pixel art animation'
  }
})

let observer = null
onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') return
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) isIntersecting.value = entry.isIntersecting
    },
    { threshold: 0.01 },
  )
  if (rootRef.value) observer.observe(rootRef.value)
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.pixel-mascot {
  display: inline-block;
  position: relative;
  /* Crisp pixel scaling - no smoothing, no blur */
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  background-position: 0 0;
  will-change: background-position, transform;
}

/*
 * Each animation walks background-position-x in absolute px (via CSS vars)
 * using steps(N) so each step jumps exactly one frame width - never interpolates.
 * Using percent here is unsafe because background-position percent is
 * relative to (container - bg-size), not bg-size, when no-repeat is set.
 */

.is-state-idle {
  animation: clawd-idle 1200ms steps(4) infinite;
}
@keyframes clawd-idle {
  from {
    background-position-x: 0;
  }
  to {
    background-position-x: var(--frame-4);
  }
}

.is-state-walk {
  animation: clawd-walk 800ms steps(8) infinite;
}
@keyframes clawd-walk {
  from {
    background-position-x: 0;
  }
  to {
    background-position-x: var(--frame-8);
  }
}

.is-state-working {
  animation: clawd-working 700ms steps(6) infinite;
}
@keyframes clawd-working {
  from {
    background-position-x: var(--frame-2);
  }
  to {
    background-position-x: var(--frame-8);
  }
}

/* Floating bob - composed with the sprite animation via comma-separated list */
.is-floating.is-state-idle {
  animation:
    clawd-idle 1200ms steps(4) infinite,
    mascot-float 4s ease-in-out infinite;
}
.is-floating.is-state-walk {
  animation:
    clawd-walk 800ms steps(8) infinite,
    mascot-float 4s ease-in-out infinite;
}
.is-floating.is-state-working {
  animation:
    clawd-working 700ms steps(6) infinite,
    mascot-float 4s ease-in-out infinite;
}

@keyframes mascot-float {
  0%,
  100% {
    transform: translateY(-2px);
  }
  50% {
    transform: translateY(2px);
  }
}

/* Off-screen or reduced-motion: freeze on starting frame, no transforms */
.pixel-mascot.is-paused,
.pixel-mascot.is-reduced {
  animation: none !important;
  background-position-x: 0 !important;
  transform: none !important;
}
.pixel-mascot.is-paused.is-state-working,
.pixel-mascot.is-reduced.is-state-working {
  background-position-x: var(--frame-2) !important;
}

@media (prefers-reduced-motion: reduce) {
  .pixel-mascot {
    animation: none !important;
    background-position-x: 0 !important;
    transform: none !important;
  }
  .pixel-mascot.is-state-working {
    background-position-x: var(--frame-2) !important;
  }
}
</style>
