<template>
  <figure class="suiscan-frame">
    <!-- Mock Suiscan header -->
    <header class="ss-header">
      <span class="ss-logo">
        <svg viewBox="0 0 32 32" class="ss-logo-icon" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16 4c-4.4 4.6-8 8.7-8 13.7 0 5 3.6 9.3 8 9.3s8-4.3 8-9.3c0-5-3.6-9.1-8-13.7zm0 19.4c-2.7 0-4.9-2.6-4.9-5.7 0-1.7.6-3.2 2-5 .6.8 1.5 1.7 2.9 1.7 1.4 0 2.3-.9 2.9-1.7 1.4 1.8 2 3.3 2 5 0 3.1-2.2 5.7-4.9 5.7z"
          />
        </svg>
        <span class="ss-logo-text">suiscan</span>
        <span class="ss-net">testnet</span>
      </span>
      <span class="ss-tx-id">tx · 0x4f2a…3a9b</span>
    </header>

    <!-- Transaction summary -->
    <div class="ss-body">
      <div class="ss-status-row">
        <span class="ss-status">
          <span class="ss-check" aria-hidden="true">✓</span>
          Success
        </span>
        <span class="ss-block">checkpoint 24,310,841</span>
        <span class="ss-time">3s ago</span>
      </div>

      <div class="ss-divider" />

      <dl class="ss-rows">
        <div class="ss-row">
          <dt>Sender</dt>
          <dd class="mono">0x9e2a…12f4</dd>
        </div>
        <div class="ss-row">
          <dt>Package</dt>
          <dd class="mono accent">aresrpg::marketplace</dd>
        </div>
        <div class="ss-row">
          <dt>Function</dt>
          <dd class="mono accent">list_item</dd>
        </div>
        <div class="ss-row">
          <dt>Module</dt>
          <dd class="mono">marketplace_v2</dd>
        </div>
      </dl>

      <div class="ss-divider" />

      <div class="ss-effects">
        <p class="ss-section-title">// effects</p>
        <ul class="ss-effect-list">
          <li class="ss-effect created">
            <span class="ss-effect-tag">created</span>
            <span class="ss-effect-text mono">Listing&lt;Sword&gt; · 0x7c…ad</span>
          </li>
          <li class="ss-effect mutated">
            <span class="ss-effect-tag">mutated</span>
            <span class="ss-effect-text mono">Inventory · 0x9e…f4</span>
          </li>
          <li class="ss-effect mutated">
            <span class="ss-effect-tag">mutated</span>
            <span class="ss-effect-text mono">Marketplace · 0xc3…ad</span>
          </li>
        </ul>
      </div>

      <div class="ss-divider" />

      <div class="ss-gas-row">
        <span class="ss-gas-label">Gas</span>
        <span class="ss-gas-value mono">0.00184 SUI</span>
        <span class="ss-gas-budget">budget · 0.01 SUI</span>
      </div>
    </div>

    <figcaption class="ss-caption">
      // representative testnet transaction · live data on suiscan ↗
    </figcaption>
  </figure>
</template>

<script setup>
/**
 * Suiscan-flavored transaction visualization for AresRPG.
 * HTML/CSS mockup styled to feel like an actual block-explorer card.
 */
</script>

<style scoped>
.suiscan-frame {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background:
    linear-gradient(
      180deg,
      color-mix(in oklab, #38bdf8 10%, var(--color-bg)) 0%,
      color-mix(in oklab, #60a5fa 4%, var(--color-surface)) 100%
    );
  border: 1px solid color-mix(in oklab, #38bdf8 35%, var(--color-line));
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.03) inset,
    0 24px 48px -28px rgba(56, 189, 248, 0.4);
}

/* Header */
.ss-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  background: color-mix(in oklab, #000 30%, var(--color-bg));
  border-bottom: 1px solid color-mix(in oklab, #38bdf8 25%, var(--color-line));
}

.ss-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
}

.ss-logo-icon {
  width: 16px;
  height: 16px;
  color: #38bdf8;
}

.ss-logo-text {
  color: var(--color-fg);
  font-weight: 600;
  text-transform: lowercase;
}

.ss-net {
  font-size: 9.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
  background: color-mix(in oklab, #fbbf24 14%, transparent);
  border: 1px solid color-mix(in oklab, #fbbf24 35%, transparent);
  color: #fbbf24;
}

.ss-tx-id {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-fg-mute);
  letter-spacing: 0.04em;
}

/* Body */
.ss-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.5;
}

.ss-status-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  font-size: 11px;
}

.ss-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-success);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.04em;
}

.ss-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--color-success) 18%, transparent);
  font-size: 10px;
}

.ss-block,
.ss-time {
  color: var(--color-fg-mute);
  font-size: 10.5px;
  letter-spacing: 0.06em;
}

.ss-divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in oklab, #38bdf8 40%, var(--color-line)) 50%,
    transparent 100%
  );
}

.ss-rows {
  display: grid;
  gap: 6px;
  margin: 0;
}

.ss-row {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 12px;
  align-items: baseline;
}

.ss-row dt {
  color: var(--color-fg-mute);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.ss-row dd {
  margin: 0;
  color: var(--color-fg);
}

.mono {
  font-family: var(--font-mono);
}

.accent {
  color: #38bdf8;
}

.ss-effects {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ss-section-title {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-fg-mute);
  margin: 0;
}

.ss-effect-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ss-effect {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 11.5px;
}

.ss-effect-tag {
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 9.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 600;
  min-width: 64px;
  justify-content: center;
}

.ss-effect.created .ss-effect-tag {
  color: var(--color-success);
  background: color-mix(in oklab, var(--color-success) 14%, transparent);
  border: 1px solid color-mix(in oklab, var(--color-success) 30%, transparent);
}

.ss-effect.mutated .ss-effect-tag {
  color: #fbbf24;
  background: color-mix(in oklab, #fbbf24 12%, transparent);
  border: 1px solid color-mix(in oklab, #fbbf24 30%, transparent);
}

.ss-effect-text {
  color: var(--color-fg-dim);
  font-size: 11.5px;
}

.ss-gas-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: baseline;
  font-size: 11px;
}

.ss-gas-label {
  color: var(--color-fg-mute);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.ss-gas-value {
  color: var(--color-fg);
  font-weight: 500;
}

.ss-gas-budget {
  color: var(--color-fg-mute);
  font-size: 10px;
}

.ss-caption {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-fg-mute);
  padding: 8px 14px;
  border-top: 1px solid color-mix(in oklab, var(--color-line) 60%, transparent);
  background: color-mix(in oklab, var(--color-bg) 50%, transparent);
}

@media (max-width: 480px) {
  .ss-row {
    grid-template-columns: 70px 1fr;
    gap: 8px;
  }
  .ss-effect-tag {
    min-width: 52px;
    font-size: 9px;
  }
}
</style>
