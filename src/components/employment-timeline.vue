<!--
  ============================================================================
  employment-timeline.vue
  ----------------------------------------------------------------------------
  Vertical timeline rail showing past employment entries from src/content/work.js.
  Year markers on the left rail, vertical line + dot per entry, role/company on
  the right column with a 2-line description, outcome chips, optional proof link.

  Most-recent entry gets a glowing dot. Mobile collapses the rail to inline dots.
  ============================================================================
-->
<template>
  <ol class="emp-timeline" aria-label="Past employment">
    <li
      v-for="(entry, i) in entries"
      :key="entry.company"
      class="emp-timeline__item"
      :class="{ 'is-current': i === 0 }"
      :data-company="entry.company"
    >
      <div class="emp-timeline__rail" aria-hidden="true">
        <span class="emp-timeline__year">{{ formatPeriod(entry.period) }}</span>
        <span class="emp-timeline__dot" />
        <span v-if="i < entries.length - 1" class="emp-timeline__line" />
      </div>

      <div class="emp-timeline__body">
        <!-- Ambient emerald sparkles around the Bitfinex entry — anchors
             the "exchange backend" gravitas without being a hard frame. -->
        <span
          v-if="entry.company === 'Bitfinex'"
          class="emp-timeline__sparkles"
          aria-hidden="true"
        >
          <span
            v-for="(s, idx) in bitfinexSparkles"
            :key="idx"
            class="emp-timeline__spark"
            :style="{
              left: s.x + '%',
              top: s.y + '%',
              '--size': s.size + 'px',
              '--delay': s.delay + 's',
              '--dur': s.dur + 's',
              '--hue': s.hue,
            }"
          />
        </span>

        <header class="emp-timeline__head">
          <h3 class="emp-timeline__company">{{ entry.company }}</h3>
          <p class="emp-timeline__role">{{ entry.role }}</p>
        </header>

        <p class="emp-timeline__desc">{{ entry.bullets[0] }}</p>

        <ul v-if="entry.outcomes?.length" class="emp-timeline__outcomes">
          <li v-for="chip in entry.outcomes" :key="chip">
            <SkillPill :name="chip" />
          </li>
        </ul>

        <a
          v-if="entry.url"
          :href="entry.url"
          target="_blank"
          rel="noreferrer noopener"
          class="btn-terminal-link emp-timeline__link"
        >
          {{ formatDomain(entry.url) }}
        </a>
      </div>
    </li>
  </ol>
</template>

<script setup>
import { computed } from 'vue'

import SkillPill from './skill-pill.vue'

const props = defineProps({
  /** @type {import('vue').PropType<import('../content/schema').WorkEntry[]>} */
  work: { type: Array, required: true },
})

/**
 * Outcome chips per entry — derived locally from each company's bullets.
 * Kept here (not in work.js) since work.js is read-only for this wave.
 */
const outcomesByCompany = {
  'Claude Code Enjoyer': ['multi-agent', 'plan-default', 'critique loops', 'ship fast'],
  AresRPG: ['react 19 · bun', 'sui move', 'falkordb', 'on-chain'],
  Bitfinex: ['multi-chain', 'sui integrated', 'production maintenance', '1.5y tenure'],
  Affinidi: ['ssi credentials', 'react · node', 'aws · ci', 'multi-tz teams'],
  Sidy: ['founder', 'cto', 'led team', 'full stack'],
  'Freelance · Open-Source': ['oss libs', 'freelance', '6y tenure'],
}

const entries = computed(() =>
  props.work.map((entry) => ({
    ...entry,
    outcomes: outcomesByCompany[entry.company] ?? [],
  })),
)

/**
 * Stable pseudo-random sparkle layout for the Bitfinex card. Emerald
 * twinkles drifting around the entry — same vocabulary as the flagship
 * section, scaled down for the timeline.
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

const sparkRng = mulberry32(0xb17f1)
const SPARK_HUES = ['#6ee7b7', '#34d399', '#a7f3d0', '#10b981']
const bitfinexSparkles = Array.from({ length: 14 }, () => ({
  x: sparkRng() * 100,
  y: sparkRng() * 100,
  size: 1 + sparkRng() * 1.6,
  delay: -sparkRng() * 5,
  dur: 3.2 + sparkRng() * 4,
  hue: SPARK_HUES[Math.floor(sparkRng() * SPARK_HUES.length)],
}))

function formatPeriod(period) {
  const fromYear = period.from?.slice(0, 4) ?? ''
  const toYear = period.to ? period.to.slice(0, 4) : 'now'
  return fromYear === toYear ? fromYear : `${fromYear} — ${toYear}`
}

function formatDomain(url) {
  try {
    const u = new URL(url)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return 'open'
  }
}
</script>

<style scoped>
.emp-timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.emp-timeline__item {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  align-items: start;
}

/* ── Rail ─────────────────────────────────────────────────────────────── */
.emp-timeline__rail {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.emp-timeline__year {
  font-family: var(--font-mono);
  font-size: var(--text-mono-2xs);
  letter-spacing: var(--track-mono-wide);
  text-transform: uppercase;
  color: var(--color-fg-mute);
  white-space: nowrap;
}

.emp-timeline__dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--color-primary);
  flex: 0 0 auto;
}

.is-current .emp-timeline__dot {
  background: var(--color-primary-glow);
  box-shadow: 0 0 12px var(--color-primary-glow);
  animation: terminal-blink 2.4s steps(2) infinite;
}

.emp-timeline__line {
  display: none; /* hidden on mobile, shown on desktop rail */
}

/* ── Body ─────────────────────────────────────────────────────────────── */
.emp-timeline__body {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  isolation: isolate;
}

/* Sparkle layer — only rendered for the Bitfinex entry. Sits behind
 * the body content with mix-blend: screen so the emerald twinkles glow
 * over the page without being visually heavy. */
.emp-timeline__sparkles {
  position: absolute;
  inset: -0.5rem -1rem;
  pointer-events: none;
  z-index: -1;
  mix-blend-mode: screen;
}

.emp-timeline__spark {
  position: absolute;
  width: var(--size);
  height: var(--size);
  border-radius: 999px;
  background: var(--hue);
  box-shadow:
    0 0 calc(var(--size) * 2.5) calc(var(--size) * 0.5) var(--hue),
    0 0 calc(var(--size) * 5) calc(var(--size) * 0.7)
      color-mix(in oklab, var(--hue) 35%, transparent);
  opacity: 0;
  animation:
    emp-spark-twinkle var(--dur) ease-in-out infinite,
    emp-spark-drift calc(var(--dur) * 2.4) ease-in-out infinite;
  animation-delay: var(--delay), var(--delay);
}

@keyframes emp-spark-twinkle {
  0%, 100% { opacity: 0; transform: scale(0.55); }
  20%      { opacity: 0.85; transform: scale(1); }
  45%      { opacity: 1; transform: scale(1.15); }
  70%      { opacity: 0.5; transform: scale(0.9); }
}

@keyframes emp-spark-drift {
  0%, 100% { translate: 0 0; }
  50%      { translate: 4px -5px; }
}

@media (prefers-reduced-motion: reduce) {
  .emp-timeline__spark {
    animation: none;
    opacity: 0.5;
    transform: none;
  }
}

.emp-timeline__head {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.emp-timeline__company {
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 1.125rem;
  letter-spacing: var(--track-h3);
  color: var(--color-fg);
  margin: 0;
}

/* Per-company gradient accents on the title — subtle contrast in the timeline */
.emp-timeline__item[data-company="Bitfinex"] .emp-timeline__company {
  background: var(--gradient-bitfinex);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 18px color-mix(in oklab, #34d399 22%, transparent);
}

.emp-timeline__item[data-company="AresRPG"] .emp-timeline__company {
  background: var(--gradient-cyan-sky);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 18px color-mix(in oklab, #60a5fa 22%, transparent);
}

.emp-timeline__item[data-company="Claude Code Enjoyer"] .emp-timeline__company {
  background: var(--gradient-hytale);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 18px color-mix(in oklab, #a855f7 22%, transparent);
}

@media (prefers-contrast: more) {
  .emp-timeline__item[data-company] .emp-timeline__company {
    background: none;
    -webkit-text-fill-color: var(--color-fg);
    color: var(--color-fg);
    text-shadow: none;
  }
}

.emp-timeline__role {
  font-family: var(--font-mono);
  font-size: var(--text-mono-xs);
  letter-spacing: var(--track-mono-wide);
  text-transform: uppercase;
  color: var(--color-fg-dim);
  margin: 0;
}

.emp-timeline__desc {
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--color-fg-dim);
  margin: 0;
  max-width: 60ch;
}

.emp-timeline__outcomes {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin: 0.25rem 0 0 0;
  padding: 0;
}

.emp-timeline__link {
  margin-top: 0.25rem;
  align-self: flex-start;
}

/* ── Desktop: vertical rail layout ────────────────────────────────────── */
@media (min-width: 768px) {
  .emp-timeline {
    gap: 3rem;
  }

  .emp-timeline__item {
    grid-template-columns: 8.5rem 1fr;
    column-gap: 1.5rem;
  }

  .emp-timeline__rail {
    position: relative;
    height: 100%;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 0.875rem;
    padding-top: 0.375rem;
  }

  .emp-timeline__year {
    text-align: right;
    padding-top: 0;
  }

  .emp-timeline__dot {
    width: 9px;
    height: 9px;
    margin-top: 0.375rem;
  }

  .emp-timeline__line {
    display: block;
    position: absolute;
    top: 1.25rem;
    right: -4px;
    width: 1px;
    height: calc(100% + 3rem);
    transform: translateX(-50%);
    background: linear-gradient(
      to bottom,
      color-mix(in oklab, var(--color-primary) 30%, transparent) 0%,
      color-mix(in oklab, var(--color-primary) 6%, transparent) 100%
    );
  }

  .emp-timeline__body {
    padding-left: 0;
    border-left: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .is-current .emp-timeline__dot {
    animation: none;
  }
}
</style>
