<template>
  <section
    ref="root"
    v-reveal
    class="stats-strip"
    aria-label="Mastery signals"
  >
    <div class="stats-strip__inner">
      <Separator type="dots" :count="40" />

      <div class="vapor-row" :class="{ 'is-revealed': revealed }">
        <span class="vapor-row__line" aria-hidden="true" />

        <!-- ─── Column 1 — Move on Sui ─── -->
        <div class="vapor-col">
          <div class="vapor-col__r0">
            <span class="vapor-col__tag">live · testnet</span>
          </div>
          <div class="vapor-col__r1">
            <span class="vapor-col__display">
              <span class="vapor-col__display-em">Move</span><span class="vapor-col__display-on">on Sui</span>
            </span>
          </div>
          <div class="vapor-col__r2" />
          <div class="vapor-col__r3">aresrpg · onchain mmorpg</div>
          <div class="vapor-col__r4">shipping move on sui</div>
        </div>

        <!-- ─── Column 2 — Unique users ─── -->
        <div class="vapor-col">
          <div class="vapor-col__r0" />
          <div class="vapor-col__r1">
            <span class="vapor-col__num">{{ usersDisplay }}<span class="vapor-col__plus">+</span></span>
          </div>
          <div class="vapor-col__r2 vapor-col__r2--text">
            unique users · solo
          </div>
          <div class="vapor-col__r3">hytale · $1k mrr</div>
          <div class="vapor-col__r4">solo live-ops</div>
        </div>

        <!-- ─── Column 3 — 12y dev experience ─── -->
        <div class="vapor-col">
          <div class="vapor-col__r0" />
          <div class="vapor-col__r1">
            <span class="vapor-col__num">12<span class="vapor-col__num-y">y</span></span>
          </div>
          <div class="vapor-col__r2">
            <svg
              class="vapor-timeline"
              :class="{ 'vapor-timeline--draw': revealed && !reduced }"
              viewBox="0 0 100 14"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <line class="tl-rail" x1="2" y1="7" x2="98" y2="7" />
              <circle class="tl-dot tl-dot--1" cx="6"  cy="7" r="2" />
              <circle class="tl-dot tl-dot--2" cx="94" cy="7" r="2" />
              <text x="6"  y="13.5" font-family="ui-monospace" font-size="3.2" text-anchor="start" fill="currentColor" opacity="0.55">2014</text>
              <text x="94" y="13.5" font-family="ui-monospace" font-size="3.2" text-anchor="end"   fill="currentColor" opacity="0.85">2026</text>
            </svg>
          </div>
          <div class="vapor-col__r3">shipping fullstack since 2014</div>
          <div class="vapor-col__r4">12 years building</div>
        </div>

        <!-- ─── Column 4 — Iterate to consensus ─── -->
        <div class="vapor-col">
          <div class="vapor-col__r0" />
          <div class="vapor-col__r1">
            <span class="vapor-col__num"><span class="vapor-col__num-n">N</span>×</span>
          </div>
          <div class="vapor-col__r2">
            <svg
              class="vapor-cycle"
              :class="{ 'vapor-cycle--play': revealed && !reduced }"
              viewBox="0 0 100 14"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <!-- 4 staggered iteration chevrons converging to a final dot -->
              <path class="cy-step cy-step--1" d="M 12 4 L 17 7 L 12 10" />
              <path class="cy-step cy-step--2" d="M 28 4 L 33 7 L 28 10" />
              <path class="cy-step cy-step--3" d="M 44 4 L 49 7 L 44 10" />
              <path class="cy-step cy-step--4" d="M 60 4 L 65 7 L 60 10" />
              <circle class="cy-final" cx="80" cy="7" r="2.6" />
            </svg>
          </div>
          <div class="vapor-col__r3">different roles · every aspect</div>
          <div class="vapor-col__r4">iterate to consensus</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import { useInView } from '../composables/use-in-view.js'
import { usePrefersReducedMotion } from '../composables/use-prefers-reduced-motion.js'
import Separator from '../components/separator.vue'

/**
 * Stats strip v4 — Vapor Columns, strict 5-row grid alignment.
 *
 *  Every column shares the same row template so things line up:
 *    r0 — status pill (only col 1) / empty
 *    r1 — BIG element (Move display / number / symbol)
 *    r2 — mid glyph or supporting text
 *    r3 — sub line (mono dim)
 *    r4 — claim (mono uppercase, the mastery line)
 *
 *  Typography unified to JetBrains Mono Bold 700 for all big elements
 *  (numbers + display) — terminal-coherent, no sans/italic mix.
 */

const USERS_TARGET = 1300
const root = ref(null)
const { inView } = useInView(root, { threshold: 0.35 })
const reduced = usePrefersReducedMotion()

const revealed = ref(false)
const usersCounter = ref(0)

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)
const DURATION_MS = 700

let rafId = 0
let startTs = 0

const tick = (ts) => {
  if (!startTs) startTs = ts
  const t = Math.min(1, (ts - startTs) / DURATION_MS)
  usersCounter.value = Math.round(USERS_TARGET * easeOutQuart(t))
  if (t < 1) rafId = requestAnimationFrame(tick)
  else rafId = 0
}

watch(
  inView,
  (visible) => {
    if (!visible) return
    revealed.value = true
    if (reduced.value) {
      usersCounter.value = USERS_TARGET
      return
    }
    if (rafId) cancelAnimationFrame(rafId)
    startTs = 0
    rafId = requestAnimationFrame(tick)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
})

const usersDisplay = computed(() => usersCounter.value.toLocaleString('en-US'))
</script>

<style scoped>
.stats-strip {
  width: 100%;
  padding: 2rem 1rem 2.5rem;
  background: transparent;
  border: 0;
  position: relative;
}

.stats-strip__inner {
  margin: 0 auto;
  max-width: 1200px;
}

/* ─── Vapor row ─── */
.vapor-row {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem 1rem;
  margin-top: 2rem;
}

@media (min-width: 760px) {
  .vapor-row {
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
  }
}

/* Single horizontal hairline through the middle (sits at row r2). */
.vapor-row__line {
  display: none;
}

@media (min-width: 760px) {
  .vapor-row__line {
    display: block;
    position: absolute;
    left: 6%;
    right: 6%;
    /* Aligns with row r2 in the 5-row grid (after r0 1.25rem + r1 3.25rem
       = 4.5rem from top + half of r2 1.75rem = 5.375rem). The col padding
       adds 1.25rem above. We pin to the row's baseline visually. */
    top: calc(1.25rem + 1.25rem + 3.25rem + 0.875rem);
    height: 1px;
    pointer-events: none;
    background: linear-gradient(
      to right,
      transparent 0%,
      color-mix(in oklab, var(--color-primary) 28%, transparent) 14%,
      color-mix(in oklab, var(--color-primary-glow) 38%, transparent) 50%,
      color-mix(in oklab, var(--color-primary) 28%, transparent) 86%,
      transparent 100%
    );
    filter: drop-shadow(0 0 4px color-mix(in oklab, var(--color-primary) 30%, transparent));
    opacity: 0;
    transform: scaleX(0.6);
    transform-origin: center;
    transition:
      opacity 900ms var(--ease-out-expo) 200ms,
      transform 900ms var(--ease-out-expo) 200ms;
  }

  .vapor-row.is-revealed .vapor-row__line {
    opacity: 0.6;
    transform: scaleX(1);
  }
}

/* ─── Column: strict 5-row grid so all columns align baseline-by-baseline ── */
.vapor-col {
  position: relative;
  display: grid;
  grid-template-rows:
    1.25rem  /* r0 — status pill / empty */
    3.25rem  /* r1 — BIG element */
    1.75rem  /* r2 — glyph or supporting text */
    1.25rem  /* r3 — sub line */
    1.5rem;  /* r4 — claim */
  row-gap: 0.4rem;
  align-items: center;
  justify-items: center;
  text-align: center;
  padding: 1.25rem 0.5rem;
  font-family: var(--font-mono);
  isolation: isolate;
  opacity: 0;
  transform: translateY(8px);
  animation: vapor-fade 600ms var(--ease-out-expo) forwards;
}

.vapor-col:nth-child(2) { animation-delay: 80ms; }
.vapor-col:nth-child(3) { animation-delay: 160ms; }
.vapor-col:nth-child(4) { animation-delay: 240ms; }
.vapor-col:nth-child(5) { animation-delay: 320ms; }

@keyframes vapor-fade {
  to { opacity: 1; transform: translateY(0); }
}

/* Per-column haze (subtle hue variance, no card outlines) */
.vapor-col::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(
    ellipse 65% 100% at 50% 50%,
    color-mix(in oklab, var(--color-primary) 4%, transparent) 0%,
    transparent 75%
  );
  transition: filter var(--dur-slow) var(--ease-out-expo);
}

.vapor-col:nth-child(3)::before {
  background: radial-gradient(
    ellipse 65% 100% at 50% 50%,
    color-mix(in oklab, var(--color-success) 4%, transparent) 0%,
    transparent 75%
  );
}

.vapor-col:hover::before { filter: brightness(1.7); }

.vapor-row:has(.vapor-col:hover) .vapor-col:not(:hover) {
  opacity: 0.5;
}

/* Row helpers */
.vapor-col__r0,
.vapor-col__r1,
.vapor-col__r2,
.vapor-col__r3,
.vapor-col__r4 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  line-height: 1;
}

/* Tag pill (col 1, r0) */
.vapor-col__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.1875rem 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-success);
  background: color-mix(in oklab, var(--color-success) 8%, transparent);
}

.vapor-col__tag::before {
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: var(--color-success);
  box-shadow: 0 0 6px color-mix(in oklab, var(--color-success) 70%, transparent);
}

/* ─── BIG row (r1) — unified mono bold 700 across all columns ─── */
.vapor-col__num {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: clamp(1.875rem, 4vw, 2.5rem);
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--color-primary);
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'zero', 'ss01';
}

.vapor-col__plus,
.vapor-col__num-n,
.vapor-col__num-y {
  font-weight: 400;
  color: var(--color-fg-mute);
}

.vapor-col__plus { color: var(--color-primary-glow); margin-left: 0.04em; }
.vapor-col__num-y { font-size: 0.6em; margin-left: 0.05em; }
.vapor-col__num-n {
  color: var(--color-primary);
  font-weight: 700;
  margin-right: 0.02em;
}

/* Card 1 display: same mono bold weight as numbers, gradient on the word */
.vapor-col__display {
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
}

.vapor-col__display-em {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: clamp(1.875rem, 4vw, 2.5rem);
  letter-spacing: -0.04em;
  background: linear-gradient(
    115deg,
    var(--color-primary-glow) 0%,
    var(--color-primary) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.vapor-col__display-on {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  text-transform: lowercase;
  letter-spacing: 0.16em;
  color: var(--color-fg-mute);
}

/* ─── Mid row (r2) ─── */
.vapor-col__r2--text {
  font-size: 0.6875rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-fg-mute);
}

.vapor-timeline {
  width: 88%;
  max-width: 130px;
  height: 14px;
  color: var(--color-primary);
  display: block;
  overflow: visible;
}

.tl-rail {
  stroke: currentColor;
  stroke-width: 0.5;
  stroke-dasharray: 1.5 2.5;
  opacity: 0.5;
}

.tl-dot {
  fill: currentColor;
  opacity: 0;
  transition: opacity 600ms var(--ease-out-expo);
}

.tl-dot--1 {
  transition-delay: 300ms;
  opacity: 0;
  fill: var(--color-fg-mute);
}
.tl-dot--2 {
  transition-delay: 500ms;
  fill: var(--color-primary-glow);
}

.vapor-timeline--draw .tl-dot { opacity: 0.7; }
.vapor-timeline--draw .tl-dot--2 { opacity: 1; }

/* Cycle glyph (col 4) — 4 chevrons stagger-pulse left-to-right then the
 * final dot brightens. Reads as "iterations converging to consensus". */
.vapor-cycle {
  width: 88%;
  max-width: 130px;
  height: 14px;
  color: currentColor;
  display: block;
  overflow: visible;
}

.cy-step {
  fill: none;
  stroke: var(--color-fg-mute);
  stroke-width: 0.9;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.35;
}

.cy-final {
  fill: var(--color-primary-glow);
  opacity: 0.45;
  transform-origin: 80px 7px;
  transform-box: view-box;
}

.vapor-cycle--play .cy-step {
  animation: cy-step-pulse 2.6s ease-in-out infinite;
}

.vapor-cycle--play .cy-step--1 { animation-delay: 0ms; }
.vapor-cycle--play .cy-step--2 { animation-delay: 200ms; }
.vapor-cycle--play .cy-step--3 { animation-delay: 400ms; }
.vapor-cycle--play .cy-step--4 { animation-delay: 600ms; }

.vapor-cycle--play .cy-final {
  animation: cy-final-pulse 2.6s ease-in-out infinite;
  animation-delay: 850ms;
}

@keyframes cy-step-pulse {
  0%, 60%, 100% {
    stroke: var(--color-fg-mute);
    opacity: 0.3;
  }
  20%, 30% {
    stroke: var(--color-primary);
    opacity: 0.95;
  }
}

@keyframes cy-final-pulse {
  0%, 100% {
    opacity: 0.45;
    transform: scale(0.85);
  }
  50% {
    opacity: 1;
    transform: scale(1.25);
  }
}

/* ─── Sub row (r3) ─── */
.vapor-col__r3 {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.04em;
  color: var(--color-fg-mute);
}

/* ─── Claim row (r4) ─── */
.vapor-col__r4 {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-fg-dim);
  font-weight: 500;
  transition: color var(--dur-normal) var(--ease-standard);
}

.vapor-col:hover .vapor-col__r4 {
  color: var(--color-fg);
}

/* ─── Reduced motion ─── */
@media (prefers-reduced-motion: reduce) {
  .vapor-col {
    animation: none;
    opacity: 1;
    transform: none;
  }
  .vapor-row__line {
    opacity: 0.7 !important;
    transform: scaleX(1) !important;
    transition: none !important;
  }
  .tl-dot { opacity: 0.7 !important; transition: none !important; }
  .cy-dot, .cy-arrow { animation: none !important; opacity: 0.85 !important; }
}
</style>
