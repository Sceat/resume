<template>
  <div class="aresrpg-shell">
    <FlagshipShell
    :id="data.id"
    :accent="data.accent"
    :eyebrow="data.eyebrow"
    :bg-image="''"
  >
    <!-- Zone 1: title -->
    <template #title>
      <span class="text-gradient-cyan-sky">AresRPG</span>
      <span class="title-suffix"> · on-chain on Sui</span>
    </template>

    <template #oneLiner>
      {{ data.oneLiner }}
    </template>

    <template #status>
      <span class="pill-status pill-status--testnet">
        <span class="pill-status__dot" aria-hidden="true" />
        testnet
      </span>
    </template>

    <!-- Zone 2: hero metric + visual -->
    <template #heroMetric>
      <span class="text-gradient-cyan-sky">on-chain</span>
    </template>

    <template #heroContext>
      Move handles authoritative state · FalkorDB caches the graph for fast reads.
    </template>

    <template #visual>
      <SuiscanScreenshot />
      <button
        type="button"
        class="play-cta play-cta--disabled"
        disabled
        aria-disabled="true"
        title="testnet paused for the next migration"
      >
        <span class="play-icon" aria-hidden="true">◼</span>
        <span class="play-text">Testnet · paused for v2</span>
      </button>
    </template>

    <!-- Zone 3: outcome + proof + dates -->
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
    </FlagshipShell>
  </div>
</template>

<script setup>
import FlagshipShell from '../components/flagship-shell.vue'
import SuiscanScreenshot from '../components/suiscan-screenshot.vue'
import { flagships } from '../content/flagships.js'

const data = flagships.find((f) => f.id === 'aresrpg')
</script>

<style>
/* AresRPG — Sui light-blue theme (intentional global override) */
[data-accent='aresrpg'] {
  --accent: #38bdf8;
  --accent-2: #60a5fa;
  --accent-gradient: linear-gradient(
    135deg,
    #38bdf8 0%,
    #60a5fa 50%,
    #93c5fd 100%
  );
}
</style>

<style scoped>
/* ============================================================
 * Shell — inject Sui-themed hex grid + film grain INSIDE the
 * FlagshipShell's bg-layer (which is z-index:0, below content
 * at z-index:2). Using :deep() so we sit above the bg image but
 * under the .bg-vignette/.bg-bottom-fade.
 * ============================================================ */
.aresrpg-shell {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.aresrpg-shell :deep(.bg-layer)::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='52' viewBox='0 0 60 52'><polygon points='30,2 58,15 58,40 30,52 2,40 2,15' stroke='rgba(147,197,253,0.18)' stroke-width='1' fill='none'/></svg>"),
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.45 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  background-repeat: repeat, repeat;
  background-size: 60px 52px, 200px 200px;
  opacity: 0.5;
  mix-blend-mode: screen;
  pointer-events: none;
  z-index: 1;
}

.title-suffix {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: 0.4em;
  color: var(--color-fg-dim);
  letter-spacing: 0.02em;
  vertical-align: middle;
  display: inline-block;
  margin-left: 0.25em;
}

.pill-status--testnet {
  color: #93c5fd;
  background: color-mix(in oklab, #38bdf8 10%, transparent);
  border-color: color-mix(in oklab, #38bdf8 40%, transparent);
}

/* Play CTA — magnetic blue glow */
.play-cta {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 22px;
  background: linear-gradient(135deg, #38bdf8 0%, #60a5fa 50%, #93c5fd 100%);
  background-size: 200% 200%;
  color: #051019;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  width: 100%;
  min-height: 52px;
  overflow: hidden;
  border: 0;
  cursor: pointer;
  transition:
    transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 220ms ease;
  animation:
    phase-drift 10s linear infinite,
    play-pulse 2.4s ease-in-out infinite;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.15) inset,
    0 16px 36px -16px rgba(56, 189, 248, 0.6);
}

/* Disabled state — testnet is currently offline */
.play-cta--disabled,
.play-cta:disabled {
  cursor: not-allowed;
  background: linear-gradient(
    135deg,
    color-mix(in oklab, #38bdf8 24%, var(--color-surface)) 0%,
    color-mix(in oklab, #60a5fa 18%, var(--color-surface-2)) 100%
  );
  color: var(--color-fg-mute);
  animation: none;
  filter: saturate(0.5);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.05) inset,
    0 4px 12px -8px rgba(0, 0, 0, 0.4);
}

.play-cta--disabled:hover,
.play-cta:disabled:hover {
  transform: none;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.05) inset,
    0 4px 12px -8px rgba(0, 0, 0, 0.4);
}

.play-cta:hover,
.play-cta:focus-visible {
  transform: translateY(-2px);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.25) inset,
    0 24px 48px -16px rgba(56, 189, 248, 0.8),
    0 0 40px -4px rgba(147, 197, 253, 0.6);
}

.play-cta:hover .play-arrow,
.play-cta:focus-visible .play-arrow {
  transform: translateX(4px);
}

.play-icon {
  font-size: 11px;
  opacity: 0.85;
}

.play-text {
  position: relative;
  z-index: 1;
}

.play-arrow {
  font-size: 16px;
  transition: transform 200ms ease;
  font-weight: 600;
}

.play-trail {
  position: absolute;
  inset: -2px -40% -2px -40%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  transform: skewX(-20deg) translateX(-100%);
  animation: trail-sweep 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes trail-sweep {
  0%, 60% {
    transform: skewX(-20deg) translateX(-100%);
  }
  90%, 100% {
    transform: skewX(-20deg) translateX(220%);
  }
}

@keyframes play-pulse {
  0%, 100% {
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.15) inset,
      0 16px 36px -16px rgba(56, 189, 248, 0.6);
  }
  50% {
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.25) inset,
      0 16px 36px -10px rgba(56, 189, 248, 0.85),
      0 0 32px -4px rgba(147, 197, 253, 0.5);
  }
}

@media (prefers-reduced-motion: reduce) {
  .play-cta {
    animation: none;
  }
  .play-trail {
    display: none;
  }
}

/* Proof */
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
  border: 1px solid color-mix(in oklab, #38bdf8 30%, var(--color-line));
  color: var(--color-fg);
  text-decoration: none;
  cursor: pointer;
  font: inherit;
  transition:
    border-color 200ms ease,
    color 200ms ease,
    background 200ms ease;
}

.proof-chip:hover,
.proof-chip:focus-visible {
  border-color: #38bdf8;
  color: #93c5fd;
  background: color-mix(in oklab, #38bdf8 10%, var(--color-surface-2));
}

.proof-chip--copied {
  border-color: var(--color-success);
  color: var(--color-success);
}

.proof-mono {
  font-family: var(--font-mono);
}

.proof-action {
  font-size: 9.5px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  opacity: 0.7;
}

.proof-chev {
  color: var(--color-fg-mute);
}

.proof-ext {
  opacity: 0.7;
  font-size: 11px;
}

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
