<template>
  <section
    v-reveal
    :id="`flagship-${id}`"
    :data-accent="accent"
    class="flagship-hero relative w-full overflow-hidden"
  >
    <!-- Background image layer (with placeholder gradient fallback) -->
    <div class="bg-layer" aria-hidden="true">
      <img
        v-if="bgImage"
        :src="bgImage"
        :alt="''"
        class="bg-img"
        loading="lazy"
        decoding="async"
      />
      <div v-else class="bg-fallback" />
      <!-- Tinted overlay -->
      <div class="bg-tint" />
      <!-- Radial vignette -->
      <div class="bg-vignette" />
      <!-- Top accent gradient bar -->
      <div class="accent-bar" />
      <!-- Bottom fade-to-bg for seamless section transitions -->
      <div class="bg-bottom-fade" />
    </div>

    <!-- Content container -->
    <div class="content-wrap">
      <div class="content-inner">
        <!-- ============================================================
             ZONE 1 — TITLE + STATUS
             Eyebrow with inline scale tokens, big title, one-liner,
             single status pill. Full width.
             ============================================================ -->
        <header class="zone zone-title">
          <p class="eyebrow">{{ eyebrow }}</p>
          <h2 class="hero-title">
            <slot name="title" />
          </h2>
          <p v-if="$slots.oneLiner" class="hero-oneliner">
            <slot name="oneLiner" />
          </p>
          <div v-if="$slots.status" class="status-row">
            <slot name="status" />
          </div>
        </header>

        <!-- ============================================================
             ZONE 2 — THE NUMBER + THE VISUAL
             Two columns desktop (50/50), stacked mobile.
             Left: hero metric + 1-line context.
             Right: visual.
             ============================================================ -->
        <div class="zone zone-body">
          <div class="hero-metric-col">
            <div v-if="$slots.heroMetric" class="hero-metric">
              <slot name="heroMetric" />
            </div>
            <p v-if="$slots.heroContext" class="hero-context">
              <slot name="heroContext" />
            </p>
          </div>
          <div class="hero-visual-col">
            <slot name="visual" />
          </div>
        </div>

        <!-- ============================================================
             ZONE 3 — OUTCOME (3 bullets max) + proof + dates
             Full-width, arrow-prefixed, mono.
             ============================================================ -->
        <footer v-if="$slots.outcome || $slots.proof || $slots.dates" class="zone zone-outcome">
          <div v-if="$slots.outcome" class="outcome-wrap">
            <slot name="outcome" />
          </div>

          <div v-if="$slots.proof || $slots.dates" class="proof-row-wrap">
            <div v-if="$slots.proof" class="proof-chips">
              <slot name="proof" />
            </div>
            <div v-if="$slots.dates" class="proof-dates">
              <slot name="dates" />
            </div>
          </div>

          <!-- Optional dossier deep-dive link -->
          <a
            v-if="dossierHref"
            :href="dossierHref"
            class="dossier-link"
          >
            <span class="dossier-prompt" aria-hidden="true">&gt;</span>
            <span>read the deep-dive</span>
            <span class="dossier-ext" aria-hidden="true">↗</span>
          </a>
        </footer>

        <!-- Collapsible stack details (hidden by default) -->
        <details v-if="$slots.stack" class="stack-details">
          <summary class="stack-toggle">
            <span class="stack-toggle-prompt" aria-hidden="true">&gt;</span>
            <span class="stack-toggle-label">stack</span>
            <span class="stack-toggle-arrow" aria-hidden="true">↗</span>
          </summary>
          <div class="stack-content">
            <slot name="stack" />
          </div>
        </details>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * Shared full-bleed flagship hero — Principal Zones pattern (v3).
 *
 * Three locked zones across all 4 flagships, recruiter-skim friendly:
 *   1) TITLE + STATUS     — eyebrow with inline tokens, H1, one-liner, status pill
 *   2) NUMBER + VISUAL    — hero metric (left) + visual (right), 50/50 desktop
 *   3) OUTCOME            — 3 arrow bullets max + proof chips + dates
 *
 * The consumer applies the per-flagship gradient class to the title slot
 * (e.g. `.text-gradient-bitfinex`) and to the heroMetric slot.
 */
defineProps({
  id: { type: String, required: true },
  accent: { type: String, required: true },
  eyebrow: { type: String, required: true },
  bgImage: { type: String, default: '' },
  /**
   * Optional deep-dive dossier link. If route doesn't exist yet, pass a hash
   * like `#dossier-<id>`. Hidden when empty.
   */
  dossierHref: { type: String, default: '' },
})
</script>

<style scoped>
/* ============================================================
 * Section shell
 * ============================================================ */
.flagship-hero {
  position: relative;
  isolation: isolate;
  /* Section drops from ~1400px to ~600-700px target */
  min-height: clamp(560px, 78vh, 720px);
  padding-block: clamp(3rem, 8vh, 5rem);
  scroll-margin-top: 5rem;
  background: var(--color-bg);
}

/* ============================================================
 * Background layer
 * ============================================================ */
.bg-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.bg-img,
.bg-fallback {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.28) saturate(1.25) contrast(1.05);
}

[data-accent='bitfinex'] .bg-fallback {
  background:
    radial-gradient(
      ellipse at 20% 30%,
      color-mix(in oklab, #10b981 38%, transparent),
      transparent 55%
    ),
    radial-gradient(
      ellipse at 80% 70%,
      color-mix(in oklab, #34d399 28%, transparent),
      transparent 55%
    ),
    linear-gradient(135deg, #051a14 0%, #07120c 60%, #04100a 100%);
}

[data-accent='hytale'] .bg-fallback {
  background:
    radial-gradient(
      ellipse at 30% 25%,
      color-mix(in oklab, #818cf8 40%, transparent),
      transparent 55%
    ),
    radial-gradient(
      ellipse at 75% 75%,
      color-mix(in oklab, #6366f1 30%, transparent),
      transparent 55%
    ),
    linear-gradient(135deg, #0a0a1f 0%, #0c0d24 60%, #050516 100%);
}

[data-accent='aresrpg'] .bg-fallback {
  background:
    radial-gradient(
      ellipse at 25% 30%,
      color-mix(in oklab, #38bdf8 42%, transparent),
      transparent 55%
    ),
    radial-gradient(
      ellipse at 80% 70%,
      color-mix(in oklab, #93c5fd 30%, transparent),
      transparent 55%
    ),
    linear-gradient(135deg, #04101e 0%, #061425 60%, #030c18 100%);
}

[data-accent='talos'] .bg-fallback {
  background:
    radial-gradient(
      ellipse at 25% 25%,
      color-mix(in oklab, #34d399 38%, transparent),
      transparent 55%
    ),
    radial-gradient(
      ellipse at 80% 80%,
      color-mix(in oklab, #10b981 28%, transparent),
      transparent 55%
    ),
    linear-gradient(135deg, #051410 0%, #061a14 60%, #03100c 100%);
}

.bg-tint {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    color-mix(in oklab, var(--color-bg) 70%, transparent) 0%,
    color-mix(in oklab, var(--color-bg) 55%, transparent) 50%,
    color-mix(in oklab, var(--color-bg) 75%, transparent) 100%
  );
}

.bg-vignette {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      ellipse 90% 80% at 50% 50%,
      transparent 0%,
      transparent 35%,
      color-mix(in oklab, var(--color-bg) 70%, transparent) 75%,
      var(--color-bg) 100%
    );
}

.accent-bar {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 2px;
  background-image: var(--accent-gradient);
  background-size: 200% 100%;
  animation: phase-drift 14s linear infinite;
  box-shadow: 0 0 24px -2px
    color-mix(in oklab, var(--accent, var(--color-primary)) 60%, transparent);
}

.bg-bottom-fade {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 12vh;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--color-bg) 100%
  );
}

@media (prefers-reduced-motion: reduce) {
  .accent-bar {
    animation: none;
  }
}

/* ============================================================
 * Content layer
 * ============================================================ */
.content-wrap {
  position: relative;
  z-index: 2;
  width: 100%;
}

.content-inner {
  max-width: 80rem; /* 1280px */
  margin-inline: auto;
  padding-inline: clamp(1.25rem, 4vw, 3rem);
  display: flex;
  flex-direction: column;
  /* Generous breathing room between zones */
  gap: clamp(2rem, 4.5vh, 3rem);
}

/* ============================================================
 * Zone shell (just a marker class for now)
 * ============================================================ */
.zone {
  width: 100%;
}

/* ============================================================
 * ZONE 1 — TITLE + STATUS
 * ============================================================ */
.zone-title {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  /* Was --color-fg-mute (#475569) which read as near-invisible against the
   * dramatic flagship backgrounds. Bumped to --color-fg-dim (#94a3b8) for
   * legibility on coloured surfaces — still subordinate to the title. */
  color: var(--color-fg-dim);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  flex-wrap: wrap;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
}

.eyebrow::before {
  content: '';
  width: 24px;
  height: 1px;
  flex-shrink: 0;
  background: color-mix(in oklab, var(--accent, var(--color-primary)) 70%, transparent);
}

.hero-title {
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: clamp(2.5rem, 6vw, 5rem);
  line-height: 0.98;
  letter-spacing: -0.03em;
  margin: 0;
  color: var(--color-fg);
}

.hero-title :deep(span),
.hero-title :deep(em) {
  display: inline-block;
}

.hero-oneliner {
  font-family: var(--font-mono);
  font-size: clamp(0.875rem, 1.3vw, 1rem);
  color: var(--color-fg-dim);
  line-height: 1.55;
  /* ~12 word cap → ~60ch */
  max-width: 60ch;
  margin: 0;
}

.status-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

/* ============================================================
 * ZONE 2 — NUMBER + VISUAL
 * Mobile: stacked. Desktop: 50/50 grid.
 * ============================================================ */
.zone-body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 900px) {
  .zone-body {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
}

.hero-metric-col {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.hero-metric {
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: clamp(4rem, 10vw, 9rem);
  line-height: 0.92;
  letter-spacing: -0.04em;
  color: var(--color-fg);
  /* Consumer applies .text-gradient-* class for per-flagship gradient */
  overflow-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}

.hero-context {
  font-family: var(--font-mono);
  font-size: clamp(0.875rem, 1.3vw, 1rem);
  color: var(--color-fg-dim);
  line-height: 1.5;
  /* ~8 word cap */
  max-width: 50ch;
  margin: 0;
}

.hero-visual-col {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ============================================================
 * ZONE 3 — OUTCOME + proof + dates + dossier link
 * ============================================================ */
.zone-outcome {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 1.5rem;
  border-top: 1px solid color-mix(in oklab, var(--accent, var(--color-primary)) 20%, var(--color-line));
}

.outcome-wrap {
  font-family: var(--font-mono);
  font-size: clamp(13px, 1.1vw, 15px);
  color: var(--color-fg);
  line-height: 1.6;
  max-width: 65ch;
}

/* Style the consumer's <ul> + <li> uniformly */
.outcome-wrap :deep(ul) {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.outcome-wrap :deep(li) {
  display: flex;
  gap: 0.625rem;
  position: relative;
  color: var(--color-fg);
}

.outcome-wrap :deep(li)::before {
  content: '→';
  flex-shrink: 0;
  color: color-mix(in oklab, var(--accent, var(--color-primary)) 80%, var(--color-fg-mute));
  font-family: var(--font-mono);
}

.proof-row-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
}

.proof-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex: 1 1 auto;
  min-width: 0;
}

.proof-dates {
  flex: 0 0 auto;
}

/* ============================================================
 * Stack details — collapsible, hidden by default
 * ============================================================ */
.stack-details {
  font-family: var(--font-mono);
}

.stack-toggle {
  display: inline-flex;
  align-items: baseline;
  gap: 0.375rem;
  font-size: 11px;
  color: var(--color-fg-mute);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  padding: 0.25rem 0;
  list-style: none;
  user-select: none;
  transition: color var(--dur-fast, 160ms) ease;
}

.stack-toggle::-webkit-details-marker {
  display: none;
}

.stack-toggle:hover,
.stack-details[open] .stack-toggle {
  color: var(--color-fg-dim);
}

.stack-toggle-prompt {
  color: color-mix(in oklab, var(--accent, var(--color-primary)) 70%, var(--color-fg-mute));
}

.stack-toggle-arrow {
  transition: transform var(--dur-fast, 160ms) ease;
  font-size: 10px;
  opacity: 0.7;
}

.stack-details[open] .stack-toggle-arrow {
  transform: rotate(135deg);
}

.stack-content {
  margin-top: 0.625rem;
}

/* ============================================================
 * Dossier deep-dive link
 * ============================================================ */
.dossier-link {
  display: inline-flex;
  align-items: baseline;
  gap: 0.375rem;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-fg-mute);
  letter-spacing: 0.08em;
  text-decoration: none;
  width: fit-content;
  margin-top: 0.25rem;
  transition: color var(--dur-fast, 160ms) ease;
}

.dossier-link:hover,
.dossier-link:focus-visible {
  color: var(--color-fg-dim);
}

.dossier-prompt {
  color: color-mix(in oklab, var(--accent, var(--color-primary)) 70%, var(--color-fg-mute));
}

.dossier-ext {
  opacity: 0.7;
  font-size: 10px;
}

/* ============================================================
 * Mobile refinements
 * ============================================================ */
@media (max-width: 600px) {
  .flagship-hero {
    padding-block: clamp(2.5rem, 6vh, 4rem);
    min-height: auto;
  }

  .content-inner {
    gap: 2rem;
  }

  .hero-metric {
    /* Slightly smaller on mobile to avoid horizontal overflow */
    font-size: clamp(3rem, 16vw, 5.5rem);
  }

  .proof-row-wrap {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.625rem;
  }
}
</style>
