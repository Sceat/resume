<template>
  <div class="talos-shell">
    <!-- Background — dark terminal + scanlines + emerald sweep -->
    <div class="tl-bg" aria-hidden="true">
      <div class="tl-bg__base" />
      <div class="tl-bg__scanlines" />
      <div class="tl-bg__sweep" />
    </div>

    <FlagshipShell
      :id="data.id"
      :accent="data.accent"
      :eyebrow="data.eyebrow"
      :bg-image="''"
    >
      <template #title>
        <span class="text-gradient-cyan-sky">Talos cluster</span>
      </template>

      <template #oneLiner>
        {{ data.oneLiner }}
      </template>

      <template #status>
        <span class="pill-status">
          <span class="pill-status__dot" aria-hidden="true" />
          production
        </span>
      </template>

      <template #heroMetric>
        <span class="text-gradient-cyan-sky">33</span>
        <span class="metric-suf">helm releases</span>
      </template>

      <template #heroContext>
        everything above runs here.
      </template>

      <template #visual>
        <K9sPane class="talos-k9s" aria-label="Live K9s view of Cyril's Talos production cluster" />
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
              <span>infra owned · access on request</span>
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
    </FlagshipShell>
  </div>
</template>

<script setup>
import FlagshipShell from '../components/flagship-shell.vue'
import K9sPane from '../components/k9s-pane.vue'
import { flagships } from '../content/flagships.js'

const data = flagships.find((f) => f.id === 'talos')
</script>

<style>
[data-accent='talos'] {
  --accent: #34d399;
  --accent-2: #10b981;
  --accent-gradient: linear-gradient(
    135deg,
    #10b981 0%,
    #34d399 50%,
    #6ee7b7 100%
  );
}
</style>

<style scoped>
.talos-shell {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.talos-shell :deep(.flagship-shell) {
  background: transparent;
}

.talos-shell :deep(.bg-img),
.talos-shell :deep(.bg-fallback),
.talos-shell :deep(.bg-tint),
.talos-shell :deep(.bg-vignette) {
  display: none;
}

/* Make K9s pane the dominant element on the right column.
   Title says "60% of section width" — we lift it and bleed slightly
   beyond the visual column on wide screens. */
@media (min-width: 1100px) {
  .talos-shell :deep(.zone-body) {
    grid-template-columns: 0.8fr 1.4fr;
  }
}

/* ============================================================
 * Background — terminal #0a0d12 + scanlines + emerald sweep
 * ============================================================ */
.tl-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.tl-bg__base,
.tl-bg__scanlines,
.tl-bg__sweep {
  position: absolute;
  inset: 0;
}

.tl-bg__base {
  background:
    radial-gradient(
      ellipse at 20% 20%,
      color-mix(in oklab, #064e3b 60%, transparent),
      transparent 60%
    ),
    radial-gradient(
      ellipse at 80% 80%,
      color-mix(in oklab, #047857 38%, transparent),
      transparent 55%
    ),
    linear-gradient(180deg, #0a0d12 0%, #07090d 100%);
}

.tl-bg__scanlines {
  background: repeating-linear-gradient(
    to bottom,
    rgba(52, 211, 153, 0.025) 0px,
    rgba(52, 211, 153, 0.025) 1px,
    transparent 1px,
    transparent 4px
  );
  mix-blend-mode: overlay;
}

/* Single emerald hairline that sweeps across every ~6s */
.tl-bg__sweep {
  background: linear-gradient(
    180deg,
    transparent 0%,
    transparent calc(50% - 1px),
    rgba(52, 211, 153, 0.45) 50%,
    transparent calc(50% + 1px),
    transparent 100%
  );
  filter: blur(0.5px);
  opacity: 0;
  animation: tl-sweep 6s ease-in-out infinite;
}

@keyframes tl-sweep {
  0%   { transform: translateY(-50%); opacity: 0; }
  20%  { opacity: 0.7; }
  80%  { opacity: 0.7; }
  100% { transform: translateY(50%); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .tl-bg__sweep { animation: none; opacity: 0; }
}

.talos-shell::after {
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
 * heroMetric "33 helm releases" — number gradient, suffix mono
 * ============================================================ */
.metric-suf {
  display: block;
  font-family: var(--font-mono);
  font-size: clamp(0.75rem, 1.2vw, 0.95rem);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-fg-mute);
  margin-top: 0.25rem;
  font-weight: 400;
}

/* ============================================================
 * Status pill — production tone (use existing .pill-status)
 * ============================================================ */
:deep(.pill-status) {
  color: #34d399;
  border-color: color-mix(in oklab, #34d399 35%, transparent);
  background: color-mix(in oklab, #34d399 8%, transparent);
}

/* Proof + dates */
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
  border: 1px solid color-mix(in oklab, #34d399 30%, var(--color-line));
  color: var(--color-fg);
  text-decoration: none;
  transition:
    border-color 200ms ease,
    color 200ms ease,
    background 200ms ease;
}

.proof-chip:hover,
.proof-chip:focus-visible {
  border-color: #34d399;
  color: #6ee7b7;
  background: color-mix(in oklab, #34d399 10%, var(--color-surface-2));
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
