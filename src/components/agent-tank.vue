<template>
  <div ref="rootRef" class="agent-tank" aria-hidden="true">
    <!-- Layer 1 — soft breathing halo -->
    <div class="agent-tank__halo" />

    <!-- Layer 2 — rotating scan ring -->
    <div class="agent-tank__ring" />

    <!-- Layer 3 — orbital glyphs -->
    <div ref="orbitalsRef" class="agent-tank__orbitals">
      <span
        v-for="(o, i) in orbitals"
        :key="i"
        class="agent-tank__orbital"
        :style="{ '--radius': `${o.radius}px` }"
      >{{ o.glyph }}</span>
    </div>

    <!-- Layer 4 — mascot, tilted by cursor (animated SVG ported from ayotomcs.me) -->
    <div ref="mascotRef" class="agent-tank__mascot">
      <ClawdAnimated :size="280" />
    </div>

    <!-- Layer 5 — thought stream -->
    <div class="agent-tank__stream">
      <span class="agent-tank__stream-prompt">&gt;</span>
      <span class="agent-tank__stream-text">{{ streamText }}</span>
      <span
        class="agent-tank__stream-caret"
        :class="{ 'agent-tank__stream-caret--solid': streamTyping }"
      >▌</span>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import ClawdAnimated from './clawd-animated.vue'
import { usePrefersReducedMotion } from '../composables/use-prefers-reduced-motion.js'
import { useTypingStream } from '../composables/use-typing-stream.js'

const props = defineProps({
  tilt: { type: Number, default: 0 },
})

const reduced = usePrefersReducedMotion()
const paused = ref(false)

const rootRef = ref(null)
const mascotRef = ref(null)
const orbitalsRef = ref(null)

// 4 orbitals — distinct glyphs, varied radii, varied speeds
const orbitals = [
  { glyph: '{}', radius: 150, speed: 12000, phase: 0 },
  { glyph: ';', radius: 188, speed: 16000, phase: Math.PI * 0.6 },
  { glyph: '→', radius: 168, speed: 20000, phase: Math.PI * 1.1 },
  { glyph: '*', radius: 200, speed: 14000, phase: Math.PI * 1.7 },
]

const phrases = [
  'orchestrating 4 subagents…',
  'reading /src/sections/hero.vue',
  'aresrpg tick 2,847,392',
  'diff vs main · 0 conflicts',
  'plan: cut 3 demos, ship in 5d',
  'critique: 3 reviewers · find weak points',
]

const { text: streamText, isTyping: streamTyping } = useTypingStream(phrases, {
  paused,
  reduced,
})

// ─── orbital animation — single rAF loop ──────────────────────────────────
let raf = 0
let startTs = 0

const animateOrbitals = (ts) => {
  raf = 0
  if (!orbitalsRef.value) return
  if (!startTs) startTs = ts
  const elapsed = ts - startTs
  const els = orbitalsRef.value.querySelectorAll('.agent-tank__orbital')
  for (let i = 0; i < orbitals.length; i += 1) {
    const o = orbitals[i]
    const angle = (elapsed / o.speed) * Math.PI * 2 + o.phase
    const x = Math.cos(angle) * o.radius
    const y = Math.sin(angle) * o.radius
    els[i].style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
  }
  if (!paused.value && !reduced.value) {
    raf = requestAnimationFrame(animateOrbitals)
  }
}

const kickOrbitals = () => {
  if (!raf && !reduced.value && !paused.value) {
    startTs = 0
    raf = requestAnimationFrame(animateOrbitals)
  }
}

const renderOrbitalsStatic = () => {
  if (!orbitalsRef.value) return
  const els = orbitalsRef.value.querySelectorAll('.agent-tank__orbital')
  for (let i = 0; i < orbitals.length; i += 1) {
    const o = orbitals[i]
    const x = Math.cos(o.phase) * o.radius
    const y = Math.sin(o.phase) * o.radius
    els[i].style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
  }
}

// ─── tilt — lerped to mascot wrapper ──────────────────────────────────────
let tiltCurrent = 0
let tiltRaf = 0

const lerpTilt = () => {
  tiltRaf = 0
  const target = props.tilt
  tiltCurrent += (target - tiltCurrent) * 0.06
  if (mascotRef.value) {
    mascotRef.value.style.transform = `rotate(${(tiltCurrent * 3).toFixed(2)}deg)`
  }
  if (Math.abs(target - tiltCurrent) > 0.001) {
    tiltRaf = requestAnimationFrame(lerpTilt)
  }
}

// kick the lerp loop whenever the tilt target changes
watch(
  () => props.tilt,
  () => {
    if (reduced.value) return
    if (!tiltRaf) tiltRaf = requestAnimationFrame(lerpTilt)
  },
)

// ─── intersection observer — pause when off-screen ───────────────────────
let observer = null

onMounted(() => {
  renderOrbitalsStatic()
  if (reduced.value) return

  kickOrbitals()

  if (typeof IntersectionObserver !== 'undefined' && rootRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          paused.value = !entry.isIntersecting
          if (entry.isIntersecting) kickOrbitals()
        }
      },
      { threshold: 0.01 },
    )
    observer.observe(rootRef.value)
  }
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  if (tiltRaf) cancelAnimationFrame(tiltRaf)
  if (observer) observer.disconnect()
  observer = null
})
</script>

<style scoped>
@property --scan-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.agent-tank {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 460px;
  display: grid;
  place-items: center;
  isolation: isolate;
}

/* ── Halo — soft radial pulse ─────────────────────────────────────────── */
.agent-tank__halo {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 420px;
  height: 420px;
  margin-top: -210px;
  margin-left: -210px;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
    circle at center,
    color-mix(in oklab, var(--color-primary) 22%, transparent) 0%,
    color-mix(in oklab, var(--color-primary) 8%, transparent) 30%,
    transparent 60%
  );
  /* Make the halo round so its box-shadow is circular, not a square box. */
  border-radius: 999px;
  filter: blur(8px);
  animation: agent-halo-breathe 4s ease-in-out infinite;
  box-shadow:
    0 0 80px 20px color-mix(in oklab, var(--color-primary) 8%, transparent),
    0 0 160px 40px color-mix(in oklab, var(--color-primary) 4%, transparent);
}

@keyframes agent-halo-breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 0.85;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

/* ── Scan ring — rotating conic gradient ──────────────────────────────── */
.agent-tank__ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 340px;
  height: 340px;
  margin-top: -170px;
  margin-left: -170px;
  z-index: 1;
  pointer-events: none;
  border-radius: 999px;
  background: conic-gradient(
    from var(--scan-angle),
    transparent 0deg,
    transparent 220deg,
    color-mix(in oklab, var(--color-primary) 30%, transparent) 290deg,
    color-mix(in oklab, var(--color-primary-glow) 35%, transparent) 320deg,
    color-mix(in oklab, var(--color-primary) 10%, transparent) 350deg,
    transparent 360deg
  );
  -webkit-mask: radial-gradient(
    circle,
    transparent 0,
    transparent 158px,
    #000 160px,
    #000 169px,
    transparent 170px
  );
  mask: radial-gradient(
    circle,
    transparent 0,
    transparent 158px,
    #000 160px,
    #000 169px,
    transparent 170px
  );
  animation: agent-ring-spin 8s linear infinite;
  opacity: 0.55;
}

@keyframes agent-ring-spin {
  from { --scan-angle: 0deg; }
  to   { --scan-angle: 360deg; }
}

/* ── Orbitals ─────────────────────────────────────────────────────────── */
.agent-tank__orbitals {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  z-index: 2;
  pointer-events: none;
  /* Radii are hardcoded in JS up to 200px — scale via CSS variable so
   * mobile shrinks them proportionally without re-running the rAF math. */
  --orbital-scale: 1;
  transform: scale(var(--orbital-scale));
  transform-origin: center;
}

.agent-tank__orbital {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 16px;
  line-height: 1;
  color: color-mix(in oklab, var(--color-fg-mute) 80%, transparent);
  opacity: 0.5;
  text-shadow: 0 0 8px color-mix(in oklab, var(--color-primary) 40%, transparent);
  will-change: transform;
}

.agent-tank__orbital:nth-child(1) { font-size: 18px; }
.agent-tank__orbital:nth-child(3) { font-size: 14px; }

/* ── Mascot ───────────────────────────────────────────────────────────── */
.agent-tank__mascot {
  position: relative;
  z-index: 3;
  display: block;
  width: 280px;
  height: 280px;
  transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
  /* Inner ClawdAnimated has a hardcoded :size="280" — force it to fill
   * this wrapper instead of overflowing on mobile when the wrapper
   * shrinks to 180px. */
  overflow: hidden;
}

.agent-tank__mascot :deep(.clawd-animated) {
  width: 100% !important;
  height: 100% !important;
}

.agent-tank__mascot-img {
  display: block;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  user-select: none;
  -webkit-user-drag: none;
}

/* ── Thought stream ───────────────────────────────────────────────────── */
.agent-tank__stream {
  position: absolute;
  top: calc(50% + 200px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  display: inline-flex;
  align-items: baseline;
  gap: 0.5ch;
  width: 360px;
  max-width: 90%;
  /* No box — type sits on the shader, masked at the edges */
  padding: 0;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.4;
  color: var(--color-fg-dim);
  white-space: nowrap;
  overflow: hidden;
  justify-content: flex-start;
  /* Soft edge fade so phrases bleed at the sides instead of clipping */
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 14px,
    #000 calc(100% - 24px),
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 14px,
    #000 calc(100% - 24px),
    transparent 100%
  );
}

.agent-tank__stream-prompt {
  flex: 0 0 auto;
  color: var(--color-primary);
  opacity: 0.7;
}

.agent-tank__stream-text {
  flex: 1 1 auto;
  color: var(--color-fg-dim);
  overflow: hidden;
  text-overflow: clip;
}

.agent-tank__stream-caret {
  flex: 0 0 auto;
  color: var(--color-primary);
  opacity: 0.6;
  animation: agent-caret-blink 0.95s steps(2) infinite;
}

.agent-tank__stream-caret--solid {
  animation: none;
  opacity: 0.95;
}

@keyframes agent-caret-blink {
  0%, 49% { opacity: 0.95; }
  50%, 100% { opacity: 0; }
}

/* ── Mobile — shrink everything ──────────────────────────────────────── */
@media (max-width: 879px) {
  .agent-tank {
    min-height: 340px;
    /* Clip orbital glyphs and any internal overflow from bleeding into
     * the text section above on stacked mobile layout. */
    overflow: hidden;
  }
  .agent-tank__orbitals {
    --orbital-scale: 0.55;
  }
  .agent-tank__mascot {
    width: 180px;
    height: 180px;
  }
  .agent-tank__halo {
    width: 280px;
    height: 280px;
    margin-top: -140px;
    margin-left: -140px;
  }
  .agent-tank__ring {
    width: 220px;
    height: 220px;
    margin-top: -110px;
    margin-left: -110px;
  }
  .agent-tank__ring {
    -webkit-mask: radial-gradient(
      circle,
      transparent 0,
      transparent 100px,
      #000 102px,
      #000 109px,
      transparent 110px
    );
    mask: radial-gradient(
      circle,
      transparent 0,
      transparent 100px,
      #000 102px,
      #000 109px,
      transparent 110px
    );
  }
  .agent-tank__stream {
    top: calc(50% + 130px);
    width: 300px;
    font-size: 12px;
  }
}

/* ── Reduced motion — static ──────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .agent-tank__halo,
  .agent-tank__ring,
  .agent-tank__stream-caret {
    animation: none !important;
  }
  .agent-tank__mascot {
    transition: none;
  }
}

/* ── High contrast — drop the halo + ring shimmer, keep mascot ──────── */
@media (prefers-contrast: more) {
  .agent-tank__halo,
  .agent-tank__ring,
  .agent-tank__orbitals {
    display: none;
  }
}
</style>
