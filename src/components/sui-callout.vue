<template>
  <figure class="sui-callout" aria-label="Sui chain integration callout">
    <!-- HUD frame: corner ticks -->
    <span class="hud-corner hud-corner--tl" aria-hidden="true" />
    <span class="hud-corner hud-corner--tr" aria-hidden="true" />
    <span class="hud-corner hud-corner--bl" aria-hidden="true" />
    <span class="hud-corner hud-corner--br" aria-hidden="true" />

    <!-- Header -->
    <header class="sui-head">
      <span class="sui-glyph" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="14" height="14">
          <path
            fill="currentColor"
            d="M16 4c-4.4 4.6-8 8.7-8 13.7 0 5 3.6 9.3 8 9.3s8-4.3 8-9.3c0-5-3.6-9.1-8-13.7zm0 19.4c-2.7 0-4.9-2.6-4.9-5.7 0-1.7.6-3.2 2-5 .6.8 1.5 1.7 2.9 1.7 1.4 0 2.3-.9 2.9-1.7 1.4 1.8 2 3.3 2 5 0 3.1-2.2 5.7-4.9 5.7z"
          />
        </svg>
      </span>
      <h3 class="sui-title">SUI on Bitfinex</h3>
    </header>

    <p class="sui-subtitle">
      <span class="sui-em">—</span> Among the chains I integrated, this is the
      one I can talk about.
    </p>

    <!-- Redacted bars: hint at multiple chains without naming them -->
    <ul class="redacted-list" aria-label="Other integrated chains, NDA-redacted">
      <li
        v-for="(row, i) in rows"
        :key="i"
        class="redacted-row"
      >
        <span class="redacted-prefix" aria-hidden="true">#</span>
        <span class="redacted-bars" :data-w="row.bars">{{ row.glyph }}</span>
        <span class="redacted-sep" aria-hidden="true">·</span>
        <span class="redacted-label">integrated</span>
        <span class="redacted-sep" aria-hidden="true">·</span>
        <span class="redacted-year">{{ row.year }}</span>
      </li>
    </ul>

    <p class="sui-foot">
      <span class="sui-foot-prompt" aria-hidden="true">&gt;</span>
      <span>NDA-respected · seniority signal</span>
    </p>
  </figure>
</template>

<script setup>
/**
 * SuiCallout — emerald-bordered HUD frame.
 * Hero callout: Sui on Bitfinex, the one chain I can publicly mention.
 * Below: redacted bars hint at multiple unnamed integrated chains.
 */
const rows = [
  { bars: 5, glyph: '▮▮▮▮▮', year: '2023' },
  { bars: 3, glyph: '▮▮▮', year: '2023' },
  { bars: 4, glyph: '▮▮▮▮', year: '2024' },
]
</script>

<style scoped>
.sui-callout {
  --frame: #10b981;
  --frame-glow: #34d399;

  position: relative;
  isolation: isolate;
  width: 100%;
  max-width: 340px;
  padding: 1.125rem 1.25rem 1rem;
  margin: 0;
  background:
    linear-gradient(
      180deg,
      color-mix(in oklab, #052e1e 70%, transparent) 0%,
      color-mix(in oklab, #022c22 80%, transparent) 100%
    );
  border: 1px solid color-mix(in oklab, var(--frame) 50%, var(--color-line));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 0 0 1px color-mix(in oklab, var(--frame) 12%, transparent),
    0 18px 36px -22px color-mix(in oklab, var(--frame) 60%, transparent);
  font-family: var(--font-mono);
}

/* HUD corner ticks */
.hud-corner {
  position: absolute;
  width: 8px;
  height: 8px;
  border: 1px solid var(--frame-glow);
  pointer-events: none;
}
.hud-corner--tl { top: -1px; left: -1px;  border-right: 0; border-bottom: 0; }
.hud-corner--tr { top: -1px; right: -1px; border-left: 0;  border-bottom: 0; }
.hud-corner--bl { bottom: -1px; left: -1px;  border-right: 0; border-top: 0; }
.hud-corner--br { bottom: -1px; right: -1px; border-left: 0;  border-top: 0; }

/* Header */
.sui-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.sui-glyph {
  color: var(--frame-glow);
  display: inline-flex;
  filter: drop-shadow(0 0 8px color-mix(in oklab, var(--frame-glow) 60%, transparent));
}

.sui-title {
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #d1fae5;
  margin: 0;
  text-transform: uppercase;
}

.sui-subtitle {
  font-size: 11.5px;
  line-height: 1.55;
  color: var(--color-fg-dim);
  margin: 0 0 0.875rem;
  letter-spacing: 0.01em;
}

.sui-em {
  color: var(--frame-glow);
  margin-right: 0.25rem;
}

/* Redacted list */
.redacted-list {
  list-style: none;
  margin: 0;
  padding: 0.625rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  border-top: 1px dashed color-mix(in oklab, var(--frame) 30%, transparent);
  border-bottom: 1px dashed color-mix(in oklab, var(--frame) 30%, transparent);
}

.redacted-row {
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
  font-size: 11px;
  color: var(--color-fg-mute);
  font-variant-numeric: tabular-nums;
}

.redacted-prefix {
  color: color-mix(in oklab, var(--frame-glow) 60%, var(--color-fg-mute));
  font-size: 10px;
  width: 0.85em;
  flex-shrink: 0;
}

.redacted-bars {
  color: color-mix(in oklab, var(--frame-glow) 38%, var(--color-fg-mute));
  letter-spacing: -0.04em;
  font-size: 12px;
  user-select: none;
  flex-shrink: 0;
}

.redacted-sep {
  color: var(--color-fg-mute);
  opacity: 0.55;
}

.redacted-label {
  text-transform: lowercase;
  letter-spacing: 0.04em;
}

.redacted-year {
  color: var(--color-fg-dim);
}

/* Footer */
.sui-foot {
  margin: 0.625rem 0 0;
  display: inline-flex;
  align-items: baseline;
  gap: 0.375rem;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-fg-mute);
}

.sui-foot-prompt {
  color: var(--frame-glow);
}

@media (max-width: 600px) {
  .sui-callout {
    max-width: 100%;
  }
}
</style>
