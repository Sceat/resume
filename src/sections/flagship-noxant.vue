<template>
  <div class="noxant-shell">
    <!-- Background — dark terminal + scanlines + purple sweep -->
    <div class="nx-bg" aria-hidden="true">
      <div class="nx-bg__base" />
      <div class="nx-bg__scanlines" />
      <div class="nx-bg__sweep" />
    </div>

    <FlagshipShell
      :id="data.id"
      :accent="data.accent"
      :eyebrow="data.eyebrow"
      :bg-image="''"
    >
      <template #title>
        <span class="text-gradient-noxant">Noxant</span>
      </template>

      <template #oneLiner>
        {{ data.oneLiner }}
      </template>

      <template #status>
        <span class="pill-status">
          <span class="pill-status__dot" aria-hidden="true" />
          live
        </span>
      </template>

      <template #heroMetric>
        <span class="text-gradient-noxant">0</span>
        <span class="metric-suf">humans in the loop</span>
      </template>

      <template #heroContext>
        pipelines that ship without you.
      </template>

      <template #visual>
        <div
          class="agent-pane"
          role="img"
          aria-label="Simulated agent pipeline feed — build, verify, publish, DinD pool"
        >
          <!-- Header bar -->
          <div class="agent-pane__header">
            <div class="agent-pane__title">
              <span class="agent-pane__bullet" aria-hidden="true">~/noxant</span>
              <span class="agent-pane__sep" aria-hidden="true">·</span>
              <span class="agent-pane__ctx">agents ▮</span>
              <span class="agent-pane__sep" aria-hidden="true">·</span>
              <span class="agent-pane__view">pipeline/main</span>
            </div>
            <div class="agent-pane__shortcuts" aria-hidden="true">
              <kbd>tail</kbd>
              <kbd>-f</kbd>
            </div>
          </div>

          <!-- Meta strip -->
          <div class="agent-pane__meta" aria-hidden="true">
            <span><span class="lbl">Runtime:</span> DinD</span>
            <span><span class="lbl">Pool:</span> 4/8</span>
            <span><span class="lbl">Queue:</span> 1</span>
            <span><span class="lbl">Verified:</span> 217</span>
            <span><span class="lbl">Published:</span> 209</span>
          </div>

          <!-- Pipeline feed -->
          <div class="agent-pane__feed">
            <div class="feed-row feed-row--running">
              <span class="feed-row__branch" aria-hidden="true">┌─</span>
              <span class="feed-row__name">agent/build</span>
              <span class="feed-row__sep" aria-hidden="true">·</span>
              <span class="feed-row__state">
                <span class="state-dot state-dot--running" aria-hidden="true" />
                running
              </span>
              <span class="feed-row__bar" aria-hidden="true">
                <span class="bar-fill" style="width: 82%" />
              </span>
              <span class="feed-row__pct">82%</span>
            </div>

            <div class="feed-row">
              <span class="feed-row__branch" aria-hidden="true">├─</span>
              <span class="feed-row__name">agent/verify</span>
              <span class="feed-row__sep" aria-hidden="true">·</span>
              <span class="feed-row__state feed-row__state--queued">
                <span class="state-dot state-dot--queued" aria-hidden="true" />
                queued
              </span>
              <span class="feed-row__hint">awaits build</span>
            </div>

            <div class="feed-row">
              <span class="feed-row__branch" aria-hidden="true">├─</span>
              <span class="feed-row__name">agent/publish</span>
              <span class="feed-row__sep" aria-hidden="true">·</span>
              <span class="feed-row__state feed-row__state--idle">
                <span class="state-dot state-dot--idle" aria-hidden="true" />
                idle
              </span>
              <span class="feed-row__hint">npm + git tag</span>
            </div>

            <div class="feed-row feed-row--pool">
              <span class="feed-row__branch" aria-hidden="true">└─</span>
              <span class="feed-row__name">DinD pool</span>
              <span class="feed-row__sep" aria-hidden="true">·</span>
              <span class="feed-row__state feed-row__state--info">
                <span class="state-dot state-dot--info" aria-hidden="true" />
                4/8 slots
              </span>
              <span class="feed-row__bar" aria-hidden="true">
                <span class="bar-fill bar-fill--info" style="width: 50%" />
              </span>
            </div>
          </div>

          <!-- Footer log line -->
          <div class="agent-pane__footer" aria-hidden="true">
            <span class="agent-pane__footer-prompt">&gt;</span>
            <span class="agent-pane__footer-log">
              agent/verify → diff clean · tests 142/142 · publishing
            </span>
          </div>

          <!-- Scanline overlay -->
          <div class="agent-pane__scan" aria-hidden="true" />
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
              <span>private · access on request</span>
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
import { flagships } from '../content/flagships.js'

const data = flagships.find((f) => f.id === 'noxant')
</script>

<style>
[data-accent='noxant'] {
  --accent: #a855f7;
  --accent-2: #c084fc;
  --accent-gradient: linear-gradient(
    135deg,
    #6d28d9 0%,
    #a855f7 50%,
    #d8b4fe 100%
  );
}

.text-gradient-noxant {
  background-image: linear-gradient(
    135deg,
    #c084fc 0%,
    #a855f7 50%,
    #d8b4fe 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  -webkit-font-smoothing: antialiased;
  text-shadow: 0 0 24px color-mix(in oklab, #a855f7 30%, transparent);
}

@media (prefers-contrast: more) {
  .text-gradient-noxant {
    background-image: none;
    color: var(--color-fg);
    -webkit-text-fill-color: var(--color-fg);
    text-shadow: none;
  }
}
</style>

<style scoped>
.noxant-shell {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.noxant-shell :deep(.flagship-shell) {
  background: transparent;
}

.noxant-shell :deep(.bg-img),
.noxant-shell :deep(.bg-fallback),
.noxant-shell :deep(.bg-tint),
.noxant-shell :deep(.bg-vignette) {
  display: none;
}

/* Mirror Talos's column rebalance — let the agent pane breathe wide. */
@media (min-width: 1100px) {
  .noxant-shell :deep(.zone-body) {
    grid-template-columns: 0.8fr 1.4fr;
  }
}

/* ============================================================
 * Background — terminal #0a0d12 + scanlines + purple sweep
 * ============================================================ */
.nx-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.nx-bg__base,
.nx-bg__scanlines,
.nx-bg__sweep {
  position: absolute;
  inset: 0;
}

.nx-bg__base {
  background:
    radial-gradient(
      ellipse at 20% 20%,
      color-mix(in oklab, #3b0764 60%, transparent),
      transparent 60%
    ),
    radial-gradient(
      ellipse at 80% 80%,
      color-mix(in oklab, #6d28d9 38%, transparent),
      transparent 55%
    ),
    linear-gradient(180deg, #0a0d12 0%, #07090d 100%);
}

.nx-bg__scanlines {
  background: repeating-linear-gradient(
    to bottom,
    rgba(168, 85, 247, 0.025) 0px,
    rgba(168, 85, 247, 0.025) 1px,
    transparent 1px,
    transparent 4px
  );
  mix-blend-mode: overlay;
}

/* Single purple hairline that sweeps across every ~6s */
.nx-bg__sweep {
  background: linear-gradient(
    180deg,
    transparent 0%,
    transparent calc(50% - 1px),
    rgba(168, 85, 247, 0.45) 50%,
    transparent calc(50% + 1px),
    transparent 100%
  );
  filter: blur(0.5px);
  opacity: 0;
  animation: nx-sweep 6s ease-in-out infinite;
}

@keyframes nx-sweep {
  0%   { transform: translateY(-50%); opacity: 0; }
  20%  { opacity: 0.7; }
  80%  { opacity: 0.7; }
  100% { transform: translateY(50%); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .nx-bg__sweep { animation: none; opacity: 0; }
}

.noxant-shell::after {
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
 * heroMetric "0 humans in the loop" — number gradient, suffix mono
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
 * Status pill — live/purple tone
 * ============================================================ */
:deep(.pill-status) {
  color: #c084fc;
  border-color: color-mix(in oklab, #a855f7 35%, transparent);
  background: color-mix(in oklab, #a855f7 8%, transparent);
}

:deep(.pill-status .pill-status__dot) {
  background: #a855f7;
  box-shadow: 0 0 8px #a855f7;
}

/* ============================================================
 * Agent pipeline pane — terminal feed mocking 4 agent rows
 * ============================================================ */
.agent-pane {
  position: relative;
  isolation: isolate;
  border: 1px solid color-mix(in oklab, #a855f7 28%, var(--color-line));
  background: linear-gradient(
    180deg,
    color-mix(in oklab, #1a0a2e 92%, var(--color-bg)) 0%,
    color-mix(in oklab, #0f0820 92%, var(--color-bg)) 100%
  );
  font-family: var(--font-mono);
  font-size: 0.78rem;
  line-height: 1.55;
  color: var(--color-fg-dim);
  overflow: hidden;
  box-shadow:
    0 0 0 1px color-mix(in oklab, #a855f7 10%, transparent),
    0 24px 60px -30px color-mix(in oklab, #a855f7 40%, transparent),
    inset 0 1px 0 color-mix(in oklab, #c084fc 12%, transparent);
}

/* ─── Header ─── */
.agent-pane__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0.875rem;
  border-bottom: 1px solid color-mix(in oklab, #a855f7 18%, var(--color-line));
  background: color-mix(in oklab, #2e1065 35%, transparent);
  font-size: 0.72rem;
  letter-spacing: 0.02em;
  flex-wrap: wrap;
}

.agent-pane__title {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-fg);
}

.agent-pane__bullet {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.1rem 0.4rem;
  background: color-mix(in oklab, #a855f7 22%, transparent);
  color: #d8b4fe;
  font-weight: 600;
  letter-spacing: 0.06em;
  font-size: 0.65rem;
}

.agent-pane__sep { color: var(--color-fg-mute); }
.agent-pane__ctx { color: #c084fc; }
.agent-pane__view { color: var(--color-fg-dim); }

.agent-pane__shortcuts {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.agent-pane__shortcuts kbd {
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
.agent-pane__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
  padding: 0.5rem 0.875rem;
  border-bottom: 1px solid color-mix(in oklab, #a855f7 12%, var(--color-line));
  background: color-mix(in oklab, #2e1065 18%, transparent);
  color: var(--color-fg-dim);
  font-size: 0.7rem;
}

.agent-pane__meta .lbl {
  color: var(--color-fg-mute);
  margin-right: 0.25rem;
}

/* ─── Feed rows ─── */
.agent-pane__feed {
  padding: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  border-bottom: 1px solid color-mix(in oklab, #a855f7 12%, var(--color-line));
}

.feed-row {
  display: grid;
  grid-template-columns: 22px 1fr auto auto auto auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.3rem 0.4rem;
  font-size: 0.74rem;
  border: 1px solid transparent;
  transition: background 200ms ease;
}

.feed-row--running {
  background: color-mix(in oklab, #a855f7 14%, transparent);
  border-color: color-mix(in oklab, #a855f7 30%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, #a855f7 18%, transparent);
}

.feed-row__branch {
  color: var(--color-fg-mute);
  font-variant-numeric: tabular-nums;
}

.feed-row__name {
  color: var(--color-fg);
  font-weight: 500;
}

.feed-row--running .feed-row__name {
  color: #d8b4fe;
}

.feed-row__sep {
  color: var(--color-fg-mute);
}

.feed-row__state {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-fg-dim);
  font-variant-numeric: tabular-nums;
}

.feed-row--running .feed-row__state {
  color: #c084fc;
}

.feed-row__state--queued { color: var(--color-fg-dim); }
.feed-row__state--idle { color: var(--color-fg-mute); }
.feed-row__state--info { color: var(--color-fg-dim); }

.feed-row__bar {
  display: inline-block;
  position: relative;
  width: 90px;
  height: 6px;
  background: color-mix(in oklab, var(--color-bg) 80%, transparent);
  border: 1px solid color-mix(in oklab, #a855f7 18%, var(--color-line));
  overflow: hidden;
}

.bar-fill {
  display: block;
  height: 100%;
  background: linear-gradient(
    90deg,
    #a855f7 0%,
    #c084fc 100%
  );
  box-shadow: 0 0 6px -1px color-mix(in oklab, #a855f7 60%, transparent);
}

.bar-fill--info {
  background: linear-gradient(
    90deg,
    color-mix(in oklab, #a855f7 50%, var(--color-fg-mute)) 0%,
    color-mix(in oklab, #c084fc 50%, var(--color-fg-mute)) 100%
  );
  box-shadow: none;
}

.feed-row__pct {
  color: #d8b4fe;
  font-variant-numeric: tabular-nums;
  font-size: 0.72rem;
}

.feed-row__hint {
  color: var(--color-fg-mute);
  font-size: 0.7rem;
  font-style: italic;
}

/* ─── State dots ─── */
.state-dot {
  display: inline-block;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: var(--color-fg-mute);
  flex-shrink: 0;
}

.state-dot--running {
  background: #a855f7;
  box-shadow: 0 0 8px -1px color-mix(in oklab, #a855f7 80%, transparent);
  animation: nx-dot-pulse 1.8s ease-in-out infinite;
}

.state-dot--queued {
  background: var(--color-fg-dim);
  box-shadow: 0 0 6px -1px color-mix(in oklab, var(--color-fg-dim) 50%, transparent);
}

.state-dot--idle {
  background: var(--color-fg-mute);
}

.state-dot--info {
  background: #c084fc;
  box-shadow: 0 0 6px -1px color-mix(in oklab, #c084fc 50%, transparent);
}

@keyframes nx-dot-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 6px -1px color-mix(in oklab, #a855f7 60%, transparent);
  }
  50% {
    transform: scale(1.18);
    box-shadow: 0 0 14px 0 color-mix(in oklab, #a855f7 90%, transparent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .state-dot--running {
    animation: none;
  }
}

/* ─── Footer log line ─── */
.agent-pane__footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: color-mix(in oklab, #2e1065 35%, transparent);
  font-size: 0.7rem;
  color: var(--color-fg-dim);
}

.agent-pane__footer-prompt {
  color: #c084fc;
  font-weight: 600;
}

.agent-pane__footer-log {
  color: var(--color-fg-dim);
}

/* ─── Scanlines (subtle) ─── */
.agent-pane__scan {
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

@media (max-width: 767px) {
  .agent-pane__feed {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .feed-row {
    grid-template-columns: 22px 1fr auto auto;
  }
  .feed-row__bar,
  .feed-row__hint {
    display: none;
  }
  .agent-pane__scan {
    display: none;
  }
}

/* ============================================================
 * Proof + dates
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
  transition:
    border-color 200ms ease,
    color 200ms ease,
    background 200ms ease;
}

.proof-chip:hover,
.proof-chip:focus-visible {
  border-color: #a855f7;
  color: #d8b4fe;
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
