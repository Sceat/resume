<template>
  <div class="bitfinex-shell">
    <!-- Background visual layers (carbon + emerald + grain + hairlines + sparkles) -->
    <div class="bx-bg" aria-hidden="true">
      <div class="bx-bg__gradient" />
      <div class="bx-bg__carbon" />
      <div class="bx-bg__hairlines" />
      <div class="bx-bg__grain" />
      <div class="bx-bg__sparkles">
        <span
          v-for="(s, i) in sparkles"
          :key="i"
          class="bx-bg__spark"
          :style="{
            left: s.x + '%',
            top: s.y + '%',
            '--size': s.size + 'px',
            '--delay': s.delay + 's',
            '--dur': s.dur + 's',
            '--hue': s.hue,
          }"
        />
      </div>
    </div>

    <FlagshipHero
      :id="data.id"
      :accent="data.accent"
      :eyebrow="data.eyebrow"
      :bg-image="''"
    >
      <template #title>
        <span class="text-gradient-bitfinex">Bitfinex</span>
        <span class="enterprise-tag" aria-hidden="true">[ENTERPRISE]</span>
      </template>

      <template #oneLiner>
        {{ data.oneLiner }}
      </template>

      <template #status>
        <span class="pill-status pill-status--past">
          <span class="pill-status__dot" aria-hidden="true" />
          past · 1.5y tenure
        </span>
      </template>

      <template #heroMetric>
        <span class="text-gradient-bitfinex">Multi-chain</span>
      </template>

      <template #heroContext>
        backend integration specialist — multiple chains, Sui among them.
      </template>

      <template #visual>
        <SuiCallout />
      </template>

      <template #outcome>
        <ul>
          <li v-for="(o, i) in data.outcome" :key="i">{{ o }}</li>
        </ul>
      </template>

      <template #proof>
        <ul class="proof-row">
          <li v-for="p in data.proof" :key="p.label">
            <a
              v-if="p.href"
              :href="p.href"
              target="_blank"
              rel="noopener noreferrer"
              class="proof-chip"
            >
              <span class="proof-chev" aria-hidden="true">&gt;</span>
              <span>{{ p.label }}</span>
              <span class="proof-ext" aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>
      </template>

      <template #dates>
        <p class="dates">{{ data.dates }}</p>
      </template>
    </FlagshipHero>
  </div>
</template>

<script setup>
import FlagshipHero from '../components/flagship-hero.vue'
import SuiCallout from '../components/sui-callout.vue'
import { flagships } from '../content/flagships.js'

const data = flagships.find((f) => f.id === 'bitfinex')

/**
 * Stable pseudo-random sparkle layout. Generated once per page-load with
 * a fixed seed so the layout is consistent across re-renders but feels
 * organic. 22 sparkles, varied size/twinkle-duration/hue.
 */
function mulberry32(seed) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rng = mulberry32(0xb17f1)
const HUES = ['#6ee7b7', '#34d399', '#a7f3d0', '#10b981']
const sparkles = Array.from({ length: 22 }, () => ({
  x: rng() * 100,
  y: rng() * 100,
  size: 1.2 + rng() * 1.8,           // 1.2–3.0px core
  delay: -rng() * 6,                  // start at random phase
  dur: 3.5 + rng() * 4,               // 3.5–7.5s twinkle cycle
  hue: HUES[Math.floor(rng() * HUES.length)],
}))
</script>

<!-- Global accent override (cascades into FlagshipHero) -->
<style>
[data-accent='bitfinex'] {
  --accent: #10b981;
  --accent-2: #34d399;
  --accent-gradient: linear-gradient(
    115deg,
    #0fb87a 0%,
    #34d399 35%,
    #6ee7b7 65%,
    #10b981 100%
  );
}
</style>

<style scoped>
/* ============================================================
 * Shell wraps FlagshipHero so we can layer carbon + gradient
 * + hairlines + grain BEHIND it.
 * ============================================================ */
.bitfinex-shell {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.bitfinex-shell :deep(.flagship-hero) {
  background: transparent;
}

/* Hide the default bg-image / fallback / tint / vignette */
.bitfinex-shell :deep(.bg-img),
.bitfinex-shell :deep(.bg-fallback),
.bitfinex-shell :deep(.bg-tint),
.bitfinex-shell :deep(.bg-vignette) {
  display: none;
}

/* ============================================================
 * Background — 4 stacked layers
 * 1) Heavy 135° emerald gradient (deep enterprise feel)
 * 2) Carbon-fiber 4×4 SVG tile @ 6% opacity
 * 3) Bloomberg-style horizontal hairlines every 80px
 * 4) 0.8% film grain via SVG turbulence
 * ============================================================ */
.bx-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.bx-bg__gradient,
.bx-bg__carbon,
.bx-bg__hairlines,
.bx-bg__grain {
  position: absolute;
  inset: 0;
}

.bx-bg__gradient {
  background: linear-gradient(
    135deg,
    #052e1e 0%,
    #064e3b 30%,
    #047857 60%,
    #064e3b 85%,
    #022c22 100%
  );
}

.bx-bg__carbon {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='4' height='4'><rect width='2' height='2' fill='%23000'/><rect x='2' y='2' width='2' height='2' fill='%23000'/></svg>");
  background-repeat: repeat;
  background-size: 4px 4px;
  opacity: 0.06;
}

.bx-bg__hairlines {
  background-image: repeating-linear-gradient(
    180deg,
    transparent 0,
    transparent 79px,
    color-mix(in oklab, #10b981 7%, transparent) 79px,
    color-mix(in oklab, #10b981 7%, transparent) 80px
  );
  mix-blend-mode: overlay;
}

.bx-bg__grain {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  opacity: 0.008;
  mix-blend-mode: overlay;
}

/* ============================================================
 * Sparkle layer — ambient emerald glints drifting + twinkling.
 * Each spark is a 1px core + 2-stop radial bloom that pulses on
 * a per-particle delay/duration so they never lockstep.
 * ============================================================ */
.bx-bg__sparkles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: screen;
}

.bx-bg__spark {
  position: absolute;
  width: var(--size);
  height: var(--size);
  border-radius: 999px;
  background: var(--hue);
  box-shadow:
    0 0 calc(var(--size) * 2) calc(var(--size) * 0.4) var(--hue),
    0 0 calc(var(--size) * 5) calc(var(--size) * 0.6)
      color-mix(in oklab, var(--hue) 35%, transparent);
  opacity: 0;
  transform: translateY(0) scale(0.7);
  animation:
    bx-spark-twinkle var(--dur) ease-in-out infinite,
    bx-spark-drift calc(var(--dur) * 2.4) ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes bx-spark-twinkle {
  0%, 100% { opacity: 0; transform: translateY(0) scale(0.6); }
  10%      { opacity: 0.65; transform: translateY(-2px) scale(1); }
  35%      { opacity: 1; transform: translateY(-3px) scale(1.15); }
  60%      { opacity: 0.55; transform: translateY(-2px) scale(1); }
}

@keyframes bx-spark-drift {
  0%, 100% { translate: 0 0; }
  50%      { translate: 4px -6px; }
}

@media (prefers-reduced-motion: reduce) {
  .bx-bg__spark {
    animation: none;
    opacity: 0.55;
    transform: none;
  }
}

/* Soft seam to next section */
.bitfinex-shell::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 14vh;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--color-bg) 100%
  );
  z-index: 1;
  pointer-events: none;
}

/* ============================================================
 * [ENTERPRISE] tag on title
 * ============================================================ */
.enterprise-tag {
  display: inline-block;
  margin-left: 0.625rem;
  padding: 2px 6px;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.18em;
  font-weight: 500;
  text-transform: uppercase;
  color: #6ee7b7;
  border: 1px solid color-mix(in oklab, #10b981 50%, transparent);
  background: color-mix(in oklab, #10b981 8%, transparent);
  vertical-align: middle;
  position: relative;
  top: -0.4em;
  white-space: nowrap;
}

/* Past status pill */
.pill-status--past {
  color: var(--color-fg-mute);
  background: color-mix(in oklab, var(--color-fg-mute) 6%, transparent);
  border-color: color-mix(in oklab, var(--color-fg-mute) 28%, transparent);
}

/* Proof chips */
.proof-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.proof-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-family: var(--font-mono);
  font-size: 12px;
  background: color-mix(in oklab, var(--color-surface-2) 80%, transparent);
  border: 1px solid color-mix(in oklab, #10b981 30%, var(--color-line));
  color: var(--color-fg);
  text-decoration: none;
  transition:
    border-color 200ms ease,
    color 200ms ease,
    background 200ms ease;
}

.proof-chip:hover,
.proof-chip:focus-visible {
  border-color: #10b981;
  color: #6ee7b7;
  background: color-mix(in oklab, #10b981 10%, var(--color-surface-2));
}

.proof-chev { color: var(--color-fg-mute); }
.proof-ext  { opacity: 0.7; font-size: 11px; }

.dates {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-fg-mute);
  padding: 4px 10px;
  border: 1px solid var(--color-line);
  background: var(--color-surface-2);
  letter-spacing: 0.04em;
  margin: 0;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .enterprise-tag {
    font-size: 8px;
    margin-left: 0.4rem;
  }
}
</style>
