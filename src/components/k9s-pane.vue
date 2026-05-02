<template>
  <div class="k9s-pane" role="img" :aria-label="ariaLabel">
    <!-- Header bar -->
    <div class="k9s-pane__header">
      <div class="k9s-pane__title">
        <span class="k9s-pane__bullet" aria-hidden="true">~/talos</span>
        <span class="k9s-pane__sep" aria-hidden="true">·</span>
        <span class="k9s-pane__ctx">k9s ⎈</span>
        <span class="k9s-pane__sep" aria-hidden="true">·</span>
        <span class="k9s-pane__view">prod-cluster</span>
      </div>
      <div class="k9s-pane__shortcuts" aria-hidden="true">
        <kbd>?</kbd>
        <kbd>/</kbd>
        <kbd>:pods</kbd>
      </div>
    </div>

    <!-- Cluster meta strip -->
    <div class="k9s-pane__meta" aria-hidden="true">
      <span><span class="lbl">Context:</span> talos-prod</span>
      <span><span class="lbl">Cluster:</span> talos</span>
      <span><span class="lbl">User:</span> cyril</span>
      <span><span class="lbl">K9s Rev:</span> v0.32.5</span>
      <span><span class="lbl">K8s Rev:</span> v1.30.2</span>
      <span><span class="lbl">CPU:</span> {{ liveCpu }}%</span>
      <span><span class="lbl">MEM:</span> {{ liveMem }}%</span>
    </div>

    <!-- Main pane: pods table -->
    <div class="k9s-pane__pane">
      <div class="k9s-pane__pane-title">
        <span class="bracket">[</span>
        <span>{{ pods.length }}</span>
        <span class="bracket">]</span>
        Pods
        <span class="dim">(all namespaces · -w)</span>
      </div>

      <div class="k9s-table" role="table">
        <div class="k9s-table__head" role="row">
          <span role="columnheader" class="col-ns">NAMESPACE</span>
          <span role="columnheader" class="col-name">NAME</span>
          <span role="columnheader" class="col-ready">READY</span>
          <span role="columnheader" class="col-status">STATUS</span>
          <span role="columnheader" class="col-restarts">RESTARTS</span>
          <span role="columnheader" class="col-age">AGE</span>
        </div>
        <div class="k9s-table__rule" aria-hidden="true" />
        <div
          v-for="(p, i) in pods"
          :key="p.name"
          class="k9s-table__row"
          :class="{ 'k9s-table__row--active': i === activeIdx }"
          role="row"
        >
          <span role="cell" class="col-ns" :data-ns="p.ns">{{ p.ns }}</span>
          <span role="cell" class="col-name">{{ p.name }}</span>
          <span role="cell" class="col-ready">{{ p.ready }}</span>
          <span role="cell" class="col-status">
            <span
              class="status-dot"
              :class="{
                'status-dot--running': p.status === 'Running',
                'status-dot--completed': p.status === 'Completed',
              }"
              :data-pulse="p.status === 'Running' ? 'true' : null"
              aria-hidden="true"
            />
            <span :class="{ 'status-text--ok': p.status === 'Running' }">
              {{ p.status }}
            </span>
          </span>
          <span role="cell" class="col-restarts">{{ p.restarts }}</span>
          <span role="cell" class="col-age">{{ p.age }}</span>
        </div>
      </div>
    </div>

    <!-- Bottom hot-key row -->
    <div class="k9s-pane__footer">
      <span class="k9s-pane__footer-key" aria-hidden="true">
        <kbd>?</kbd> help
      </span>
      <span class="k9s-pane__footer-sep" aria-hidden="true">·</span>
      <span class="k9s-pane__footer-key" aria-hidden="true">
        <kbd>/</kbd> filter
      </span>
      <span class="k9s-pane__footer-sep" aria-hidden="true">·</span>
      <span class="k9s-pane__footer-key" aria-hidden="true">
        <kbd>d</kbd> describe
      </span>
      <span class="k9s-pane__footer-sep" aria-hidden="true">·</span>
      <span class="k9s-pane__footer-key" aria-hidden="true">
        <kbd>l</kbd> logs
      </span>
      <span class="k9s-pane__footer-sep" aria-hidden="true">·</span>
      <span class="k9s-pane__footer-key" aria-hidden="true">
        <kbd>q</kbd> quit
      </span>
    </div>

    <!-- Walking mascot strip (bottom edge) -->
    <div class="k9s-pane__mascot-strip" aria-hidden="true">
      <span
        v-if="speech"
        class="speech-bubble"
        :key="speech"
      >{{ speech }}</span>
      <PixelMascot
        class="walking-mascot"
        state="walk"
        :size="48"
        :floating="false"
      />
    </div>

    <!-- Scanline overlay -->
    <div class="k9s-pane__scan" aria-hidden="true" />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

import PixelMascot from './pixel-mascot.vue'

/**
 * K9s-style terminal dashboard.
 *
 * Fake-but-plausible pod names that signal real workloads without leaking
 * private hostnames or IPs (Point 16 of v3 plan). Names are evocative
 * (cilium-agent, longhorn-mgr, hytale-game-edge, aresrpg-ws-gateway,
 * sops-secret-puller, backup-cronjob) so a kubectl-fluent reader instantly
 * groks the cluster.
 *
 * Live behaviors:
 *   • Running pods get a pulsing dot (CSS keyframe).
 *   • Active row rotates every 4s (mimics `kubectl get pods -w`).
 *   • CPU/MEM percentages tick mildly to feel alive.
 *   • Mascot walks left→right along the bottom; pauses ~every 15s and
 *     shows a brief speech bubble cycling 3 phrases.
 */
defineProps({
  ariaLabel: {
    type: String,
    default: 'Live K9s pods snapshot — Talos production cluster',
  },
})

const pods = ref([
  { ns: 'infra/',     name: 'cilium-agent-x4n9k',         ready: '1/1', status: 'Running',   restarts: 0, age: '73d' },
  { ns: 'infra/',     name: 'longhorn-mgr-2ph7t',         ready: '2/2', status: 'Running',   restarts: 1, age: '42d' },
  { ns: 'flagship/',  name: 'hytale-game-edge-7z2vw',     ready: '1/1', status: 'Running',   restarts: 0, age: '12d' },
  { ns: 'flagship/',  name: 'hytale-game-edge-9kqrm',     ready: '1/1', status: 'Running',   restarts: 0, age: '12d' },
  { ns: 'flagship/',  name: 'aresrpg-ws-gateway-3plqj',   ready: '1/1', status: 'Running',   restarts: 0, age: '8h' },
  { ns: 'flagship/',  name: 'aresrpg-move-indexer-x4',    ready: '1/1', status: 'Running',   restarts: 0, age: '8h' },
  { ns: 'ops/',       name: 'sops-secret-puller-v2-fg',   ready: '1/1', status: 'Running',   restarts: 0, age: '33d' },
  { ns: 'ops/',       name: 'backup-cronjob-29156712',    ready: '0/1', status: 'Completed', restarts: 0, age: '2h' },
])

const activeIdx = ref(0)
const liveCpu = ref(31)
const liveMem = ref(47)

const PHRASES = ['> healthy ✓', '> all green', '> 8/8 Running']
const speech = ref('')
let speechIdx = 0

let rotateTimer = null
let metaTimer = null
let speechTimer = null
let speechHideTimer = null

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

onMounted(() => {
  if (reduced) return

  // Rotate active row every 4s — mimics kubectl get pods -w cursor
  rotateTimer = setInterval(() => {
    activeIdx.value = (activeIdx.value + 1) % pods.value.length
    // Slightly tick AGE on the active row's clone so it feels alive
    const p = pods.value[activeIdx.value]
    if (p && /^\d+h$/.test(p.age)) {
      const n = parseInt(p.age, 10)
      p.age = `${Math.min(99, n + 1)}h`
    }
  }, 4000)

  // CPU / MEM ticks ±2 within plausible range every 3s
  metaTimer = setInterval(() => {
    liveCpu.value = clamp(liveCpu.value + rand(-2, 2), 24, 38)
    liveMem.value = clamp(liveMem.value + rand(-1, 2), 41, 53)
  }, 3000)

  // Mascot speech cycle: every ~15s show a phrase for 2s, then hide
  const cycle = () => {
    speech.value = PHRASES[speechIdx % PHRASES.length]
    speechIdx++
    speechHideTimer = setTimeout(() => (speech.value = ''), 2000)
  }
  // First bubble after a brief delay so it doesn't fire on mount
  setTimeout(cycle, 4500)
  speechTimer = setInterval(cycle, 15000)
})

onBeforeUnmount(() => {
  clearInterval(rotateTimer)
  clearInterval(metaTimer)
  clearInterval(speechTimer)
  clearTimeout(speechHideTimer)
})

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n))
}
function rand(lo, hi) {
  return Math.floor(Math.random() * (hi - lo + 1)) + lo
}
</script>

<style scoped>
.k9s-pane {
  position: relative;
  isolation: isolate;
  border: 1px solid color-mix(in oklab, #34d399 28%, var(--color-line));
  background: linear-gradient(
    180deg,
    color-mix(in oklab, #051410 92%, var(--color-bg)) 0%,
    color-mix(in oklab, #03100c 92%, var(--color-bg)) 100%
  );
  font-family: var(--font-mono);
  font-size: 0.78rem;
  line-height: 1.55;
  color: var(--color-fg-dim);
  overflow: hidden;
  box-shadow:
    0 0 0 1px color-mix(in oklab, #10b981 10%, transparent),
    0 24px 60px -30px color-mix(in oklab, #10b981 40%, transparent),
    inset 0 1px 0 color-mix(in oklab, #34d399 12%, transparent);
}

/* ─── Header ─── */
.k9s-pane__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0.875rem;
  border-bottom: 1px solid color-mix(in oklab, #34d399 18%, var(--color-line));
  background: color-mix(in oklab, #052e1e 35%, transparent);
  font-size: 0.72rem;
  letter-spacing: 0.02em;
  flex-wrap: wrap;
}

.k9s-pane__title {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-fg);
}

.k9s-pane__bullet {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.1rem 0.4rem;
  background: color-mix(in oklab, #10b981 22%, transparent);
  color: #6ee7b7;
  font-weight: 600;
  letter-spacing: 0.06em;
  font-size: 0.65rem;
}

.k9s-pane__sep { color: var(--color-fg-mute); }
.k9s-pane__ctx { color: #34d399; }
.k9s-pane__view { color: var(--color-fg-dim); }

.k9s-pane__shortcuts {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.k9s-pane__shortcuts kbd {
  display: inline-flex;
  align-items: center;
  padding: 0.05rem 0.35rem;
  border: 1px solid var(--color-line);
  background: color-mix(in oklab, var(--color-bg) 60%, transparent);
  color: var(--color-fg-mute);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.04em;
}

/* ─── Meta strip ─── */
.k9s-pane__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
  padding: 0.5rem 0.875rem;
  border-bottom: 1px solid color-mix(in oklab, #34d399 12%, var(--color-line));
  background: color-mix(in oklab, #052e1e 18%, transparent);
  color: var(--color-fg-dim);
  font-size: 0.7rem;
}

.k9s-pane__meta .lbl {
  color: var(--color-fg-mute);
  margin-right: 0.25rem;
}

/* ─── Pane ─── */
.k9s-pane__pane {
  padding: 0.875rem;
  border-bottom: 1px solid color-mix(in oklab, #34d399 12%, var(--color-line));
}

.k9s-pane__pane-title {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.625rem;
  color: #6ee7b7;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.k9s-pane__pane-title .bracket { color: var(--color-fg-mute); }

.k9s-pane__pane-title .dim {
  margin-left: 0.4rem;
  color: var(--color-fg-mute);
  text-transform: none;
  letter-spacing: 0;
}

/* ─── Pods table ─── */
.k9s-table {
  display: block;
  width: 100%;
  min-width: 620px;
}

.k9s-table__head,
.k9s-table__row {
  display: grid;
  grid-template-columns: 80px 2fr 50px 1fr 60px 50px;
  gap: 0.5rem;
  padding: 0.25rem 0.4rem;
  align-items: center;
}

.k9s-table__head {
  color: var(--color-fg-mute);
  font-size: 0.66rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.k9s-table__rule {
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    color-mix(in oklab, #34d399 25%, var(--color-line)) 8%,
    color-mix(in oklab, #34d399 25%, var(--color-line)) 92%,
    transparent
  );
  margin: 0.1rem 0 0.25rem;
}

.k9s-table__row {
  transition: background 200ms ease;
}

.k9s-table__row--active {
  background: color-mix(in oklab, #10b981 14%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, #10b981 30%, transparent);
}

.k9s-table__row .col-ns {
  color: var(--color-fg-mute);
  font-size: 0.7rem;
}

.k9s-table__row .col-ns[data-ns='infra/']    { color: #60a5fa; }
.k9s-table__row .col-ns[data-ns='flagship/'] { color: #a78bfa; }
.k9s-table__row .col-ns[data-ns='ops/']      { color: #fbbf24; }

.k9s-table__row .col-name {
  color: var(--color-fg);
  font-weight: 500;
}

.k9s-table__row .col-ready {
  color: var(--color-fg);
  font-variant-numeric: tabular-nums;
}

.k9s-table__row .col-status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-fg-dim);
  font-variant-numeric: tabular-nums;
}

.k9s-table__row .col-restarts,
.k9s-table__row .col-age {
  color: var(--color-fg);
  font-variant-numeric: tabular-nums;
}

.status-text--ok { color: #34d399; }

/* ─── Status dot ─── */
.status-dot {
  display: inline-block;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: var(--color-fg-mute);
  flex-shrink: 0;
}

.status-dot--running {
  background: #34d399;
  box-shadow: 0 0 8px -1px color-mix(in oklab, #34d399 70%, transparent);
}

.status-dot--completed {
  background: #60a5fa;
  box-shadow: 0 0 8px -1px color-mix(in oklab, #60a5fa 60%, transparent);
}

.status-dot[data-pulse='true'] {
  animation: dot-pulse 1.8s ease-in-out infinite;
}

@keyframes dot-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 6px -1px color-mix(in oklab, #34d399 60%, transparent);
  }
  50% {
    transform: scale(1.18);
    box-shadow: 0 0 14px 0 color-mix(in oklab, #34d399 90%, transparent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .status-dot[data-pulse='true'] {
    animation: none;
  }
}

/* ─── Footer hot-keys ─── */
.k9s-pane__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.875rem;
  background: color-mix(in oklab, #052e1e 35%, transparent);
  font-size: 0.68rem;
  color: var(--color-fg-dim);
  border-bottom: 1px solid color-mix(in oklab, #34d399 12%, var(--color-line));
}

.k9s-pane__footer-key {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.k9s-pane__footer-key kbd {
  padding: 0 0.3rem;
  border: 1px solid var(--color-line);
  background: color-mix(in oklab, var(--color-bg) 70%, transparent);
  color: #6ee7b7;
  font-family: var(--font-mono);
  font-size: 0.65rem;
}

.k9s-pane__footer-sep { color: var(--color-fg-mute); }

/* ─── Mascot walking strip ─── */
.k9s-pane__mascot-strip {
  position: relative;
  height: 56px;
  background: linear-gradient(
    180deg,
    color-mix(in oklab, #052e1e 30%, transparent) 0%,
    color-mix(in oklab, #022c22 50%, transparent) 100%
  );
  overflow: hidden;
}

.walking-mascot {
  position: absolute;
  bottom: 4px;
  left: 0;
  animation: mascot-walk-loop 18s linear infinite;
}

@keyframes mascot-walk-loop {
  0%   { left: -56px; }
  45%  { left: calc(45% - 24px); }
  /* "stops" briefly to look around — speech bubble appears in this window */
  50%  { left: calc(50% - 24px); }
  100% { left: calc(100% + 8px); }
}

.speech-bubble {
  position: absolute;
  bottom: 32px;
  left: calc(50% + 28px);
  padding: 3px 8px;
  background: color-mix(in oklab, #052e1e 90%, transparent);
  border: 1px solid color-mix(in oklab, #34d399 50%, transparent);
  color: #6ee7b7;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  white-space: nowrap;
  animation: bubble-fade 2s ease-out forwards;
  box-shadow: 0 0 12px -4px color-mix(in oklab, #34d399 60%, transparent);
}

@keyframes bubble-fade {
  0%   { opacity: 0; transform: translateY(4px); }
  15%  { opacity: 1; transform: translateY(0); }
  85%  { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-2px); }
}

@media (prefers-reduced-motion: reduce) {
  .walking-mascot {
    animation: none;
    left: 8px;
  }
  .speech-bubble {
    animation: none;
    opacity: 1;
  }
}

/* ─── Scanlines (subtle) ─── */
.k9s-pane__scan {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.018) 0px,
    rgba(255, 255, 255, 0.018) 1px,
    transparent 1px,
    transparent 3px
  );
  mix-blend-mode: overlay;
  z-index: 1;
}

/* Mobile: allow horizontal scroll on the table itself */
@media (max-width: 767px) {
  .k9s-pane__pane {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .k9s-pane__scan {
    display: none;
  }
}
</style>
