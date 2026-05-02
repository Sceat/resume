<template>
  <div class="hytale-shell">
    <!-- Background visual layers (indigo→magenta + hex grid + grain) -->
    <div class="hy-bg" aria-hidden="true">
      <div class="hy-bg__gradient" />
      <div class="hy-bg__hex" />
      <div class="hy-bg__grain" />
      <div class="hy-bg__vignette" />
    </div>

    <FlagshipHero
      :id="data.id"
      :accent="data.accent"
      :eyebrow="data.eyebrow"
      :bg-image="''"
    >
      <template #title>
        <span class="text-gradient-hytale">Hytale MMORPG</span>
      </template>

      <template #oneLiner>
        {{ data.oneLiner }}
      </template>

      <template #status>
        <span class="pill-status pill-status--live">
          <span class="pill-status__dot" aria-hidden="true" />
          live · production
        </span>
      </template>

      <template #heroMetric>
        <span class="text-gradient-hytale">1,300</span>
      </template>

      <template #heroContext>
        unique players · solo-run · live in production.
      </template>

      <template #visual>
        <div ref="hudRef" class="hud-grid">
          <!-- Gauge 1 — unique players (lifetime, not concurrent) -->
          <div class="gauge" :class="{ 'gauge--in': inView }">
            <div class="gauge__top">
              <span class="gauge__label">unique players</span>
              <span class="gauge__delta">▲</span>
            </div>
            <div class="gauge__num">
              <span class="num-value">{{ counts.players }}</span>
              <span class="num-suf">+</span>
            </div>
            <div class="gauge__bar">
              <span
                class="gauge__fill"
                :style="{ '--fill-pct': inView ? '78%' : '0%' }"
              />
              <span class="gauge__ring" :class="{ 'gauge__ring--on': inView }" />
            </div>
            <div class="gauge__sub">since launch · growing</div>
          </div>

          <!-- Gauge 2 — uptime -->
          <div class="gauge" :class="{ 'gauge--in': inView }">
            <div class="gauge__top">
              <span class="gauge__label">uptime</span>
              <span class="gauge__delta gauge__delta--ok">●</span>
            </div>
            <div class="gauge__num">
              <span class="num-value">{{ counts.uptime }}</span>
              <span class="num-suf">d</span>
            </div>
            <div class="gauge__bar">
              <span
                class="gauge__fill"
                :style="{ '--fill-pct': inView ? '100%' : '0%' }"
              />
              <span class="gauge__ring" :class="{ 'gauge__ring--on': inView }" />
            </div>
            <div class="gauge__sub">since last restart</div>
          </div>

          <!-- Gauge 3 — MRR -->
          <div class="gauge" :class="{ 'gauge--in': inView }">
            <div class="gauge__top">
              <span class="gauge__label">mrr</span>
              <span class="gauge__delta">▲</span>
            </div>
            <div class="gauge__num">
              <span class="num-pre">$</span>
              <span class="num-value">{{ counts.mrr }}</span>
            </div>
            <div class="gauge__bar">
              <span
                class="gauge__fill gauge__fill--magenta"
                :style="{ '--fill-pct': inView ? '75%' : '0%' }"
              />
              <span class="gauge__ring" :class="{ 'gauge__ring--on': inView }" />
            </div>
            <div class="gauge__sub">recurring · monthly</div>
          </div>

          <!-- Gauge 4 — incidents -->
          <div class="gauge" :class="{ 'gauge--in': inView }">
            <div class="gauge__top">
              <span class="gauge__label">incidents · 30d</span>
              <span class="gauge__delta gauge__delta--ok">●</span>
            </div>
            <div class="gauge__num gauge__num--mini">
              <span class="num-value">{{ counts.incidents }}</span>
            </div>
            <div class="gauge__status">
              <span class="status-dot status-dot--ok" />
              all green
            </div>
            <div class="gauge__sub">tracked via process</div>
          </div>
        </div>
      </template>

      <template #outcome>
        <ul>
          <li v-for="(o, i) in data.outcome" :key="i">{{ o }}</li>
        </ul>
      </template>

      <template #proof>
        <ul class="proof-row">
          <li v-if="!data.proof.length">
            <span class="proof-chip proof-chip--static">
              <span class="proof-chev" aria-hidden="true">&gt;</span>
              <span>private repo · NDA-style stack details on request</span>
            </span>
          </li>
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
import { ref, watch } from 'vue'
import FlagshipHero from '../components/flagship-hero.vue'
import { flagships } from '../content/flagships.js'
import { useInView } from '../composables/use-in-view.js'

const data = flagships.find((f) => f.id === 'hytale')

const hudRef = ref(null)
const { inView } = useInView(hudRef, { threshold: 0.25 })

// Count-up targets — players is lifetime unique users (not concurrent online)
const TARGETS = { players: 1300, uptime: 73, mrr: 1032, incidents: 0 }

const counts = ref({ players: 0, uptime: 0, mrr: 0, incidents: 0 })

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

watch(
  inView,
  (v) => {
    if (!v) return
    if (reduced) {
      counts.value = { ...TARGETS }
      return
    }
    const start = performance.now()
    const dur = 1400
    const ease = (t) => 1 - Math.pow(1 - t, 3)
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur)
      const e = ease(t)
      counts.value = {
        players: Math.round(TARGETS.players * e).toLocaleString(),
        uptime: Math.round(TARGETS.uptime * e),
        mrr: Math.round(TARGETS.mrr * e).toLocaleString(),
        incidents: Math.round(TARGETS.incidents * e),
      }
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  },
  { immediate: false },
)
</script>

<style>
[data-accent='hytale'] {
  --accent: #a855f7;
  --accent-2: #6366f1;
  --accent-gradient: linear-gradient(
    125deg,
    #ec4899 0%,
    #a855f7 30%,
    #6366f1 60%,
    #3b82f6 100%
  );
}
</style>

<style scoped>
.hytale-shell {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.hytale-shell :deep(.flagship-hero) {
  background: transparent;
}

.hytale-shell :deep(.bg-img),
.hytale-shell :deep(.bg-fallback),
.hytale-shell :deep(.bg-tint),
.hytale-shell :deep(.bg-vignette) {
  display: none;
}

/* ============================================================
 * Background — 4 stacked layers
 * 1) Dark indigo → magenta gradient
 * 2) Hex grid pattern overlay (game-map vibe) at 5%
 * 3) Film grain
 * 4) Vignette
 * ============================================================ */
.hy-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.hy-bg__gradient,
.hy-bg__hex,
.hy-bg__grain,
.hy-bg__vignette {
  position: absolute;
  inset: 0;
}

.hy-bg__gradient {
  background: linear-gradient(
    135deg,
    #1e1b4b 0%,
    #312e81 25%,
    #5b21b6 55%,
    #6d28d9 75%,
    #581c87 100%
  );
}

.hy-bg__hex {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='52' viewBox='0 0 60 52'><polygon points='30,2 58,15 58,40 30,52 2,40 2,15' stroke='rgba(255,255,255,0.10)' stroke-width='1' fill='none'/></svg>");
  background-repeat: repeat;
  background-size: 60px 52px;
  opacity: 0.55;
  mix-blend-mode: screen;
}

.hy-bg__grain {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  opacity: 0.012;
  mix-blend-mode: overlay;
}

.hy-bg__vignette {
  background: radial-gradient(
    ellipse 90% 80% at 50% 50%,
    transparent 0%,
    transparent 35%,
    color-mix(in oklab, var(--color-bg) 70%, transparent) 80%,
    var(--color-bg) 100%
  );
}

.hytale-shell::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 14vh;
  background: linear-gradient(180deg, transparent 0%, var(--color-bg) 100%);
  z-index: 1;
  pointer-events: none;
}

/* ============================================================
 * Live status pill — magenta tone
 * ============================================================ */
.pill-status--live {
  color: #f9a8d4;
  border-color: color-mix(in oklab, #ec4899 35%, transparent);
  background: color-mix(in oklab, #ec4899 8%, transparent);
}

.pill-status--live .pill-status__dot {
  background: #ec4899;
  box-shadow: 0 0 8px #ec4899;
}

/* ============================================================
 * HUD gauge dashboard — 2×2 Diablo-style
 * ============================================================ */
.hud-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  width: 100%;
}

@media (max-width: 480px) {
  .hud-grid {
    grid-template-columns: 1fr;
  }
}

.gauge {
  position: relative;
  isolation: isolate;
  padding: 0.875rem 1rem;
  background:
    linear-gradient(
      180deg,
      color-mix(in oklab, #1e1b4b 70%, transparent) 0%,
      color-mix(in oklab, #312e81 50%, transparent) 100%
    );
  border: 1px solid color-mix(in oklab, #a855f7 35%, var(--color-line));
  font-family: var(--font-mono);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 12px 24px -16px rgba(168, 85, 247, 0.4);
}

.gauge__top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 9.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-fg-mute);
  margin-bottom: 0.4rem;
}

.gauge__delta {
  font-size: 8px;
  color: #ec4899;
  letter-spacing: 0;
}

.gauge__delta--ok {
  color: #34d399;
}

.gauge__num {
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 1.75rem;
  line-height: 1;
  color: #fff;
  letter-spacing: -0.02em;
  display: flex;
  align-items: baseline;
  gap: 0.125rem;
  margin-bottom: 0.5rem;
  font-variant-numeric: tabular-nums;
}

.gauge__num--mini {
  font-size: 1.5rem;
}

.num-pre {
  font-size: 0.9rem;
  color: var(--color-fg-mute);
  font-weight: 500;
}

.num-suf {
  font-size: 0.875rem;
  color: var(--color-fg-mute);
  margin-left: 0.125rem;
  font-weight: 500;
}

.gauge__bar {
  position: relative;
  height: 4px;
  background: color-mix(in oklab, #1e1b4b 90%, #000);
  overflow: hidden;
  margin-bottom: 0.4rem;
}

.gauge__fill {
  --fill-pct: 0%;
  display: block;
  height: 100%;
  width: var(--fill-pct);
  background: linear-gradient(90deg, #6366f1 0%, #a855f7 60%, #ec4899 100%);
  box-shadow: 0 0 8px color-mix(in oklab, #a855f7 60%, transparent);
  transition: width 1400ms cubic-bezier(0.16, 1, 0.3, 1);
}

.gauge__fill--magenta {
  background: linear-gradient(90deg, #a855f7 0%, #ec4899 100%);
}

.gauge__ring {
  position: absolute;
  inset: -2px -2px -2px -2px;
  pointer-events: none;
  /* The ring "sweeps" by animating the conic mask angle */
  background: conic-gradient(
    from 0deg,
    color-mix(in oklab, #ec4899 60%, transparent) 0deg,
    transparent var(--ring-deg, 0deg)
  );
  opacity: 0;
  mix-blend-mode: screen;
  transition: opacity 600ms ease;
}

.gauge__ring--on {
  opacity: 0.5;
  animation: ring-sweep 1400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes ring-sweep {
  0%   { --ring-deg: 0deg;   opacity: 0; }
  20%  { opacity: 0.5; }
  100% { --ring-deg: 360deg; opacity: 0; }
}

@property --ring-deg {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.gauge__sub {
  font-size: 9.5px;
  color: var(--color-fg-mute);
  letter-spacing: 0.06em;
  margin-top: 0.25rem;
}

.gauge__status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 11px;
  color: #34d399;
  font-weight: 500;
  letter-spacing: 0.04em;
  margin-bottom: 0.4rem;
}

.status-dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: currentColor;
  box-shadow: 0 0 8px currentColor;
}

.status-dot--ok {
  background: #34d399;
}

@media (prefers-reduced-motion: reduce) {
  .gauge__fill {
    transition: none;
  }
  .gauge__ring--on {
    animation: none;
    opacity: 0;
  }
}

/* ============================================================
 * Proof + dates (kept consistent with siblings)
 * ============================================================ */
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
  border: 1px solid color-mix(in oklab, #a855f7 30%, var(--color-line));
  color: var(--color-fg);
  text-decoration: none;
}

.proof-chip:hover,
.proof-chip:focus-visible {
  border-color: #a855f7;
  color: #f5d0fe;
  background: color-mix(in oklab, #a855f7 10%, var(--color-surface-2));
}

.proof-chip--static { cursor: default; }
.proof-chev { color: var(--color-fg-mute); }
.proof-ext { opacity: 0.7; font-size: 11px; }

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
</style>
