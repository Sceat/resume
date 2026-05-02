<template>
  <!--
    Terminal chrome shell — wraps the entire portfolio in a faux Claude Code
    session window. Decorative framing (aria-hidden); content remains
    fully accessible. Disabled on the /print route so PDF rendering is clean.
  -->
  <template v-if="active">
    <header class="chrome chrome--top" aria-hidden="true">
      <span class="chrome__lights">
        <span class="chrome__light chrome__light--red" />
        <span class="chrome__light chrome__light--yellow" />
        <span class="chrome__light chrome__light--green" />
      </span>
      <span class="chrome__title">
        <span class="chrome__title-path">~/sceat-portfolio</span>
        <span class="chrome__title-sep">·</span>
        <span class="chrome__title-user">nox</span>
        <span class="chrome__title-at">@</span>
        <span class="chrome__title-host">opus-4.7</span>
      </span>
      <span class="chrome__glyphs">
        <span class="chrome__glyph">_</span>
        <span class="chrome__glyph">□</span>
        <span class="chrome__glyph">×</span>
      </span>
    </header>

    <footer class="chrome chrome--bottom" aria-hidden="true">
      <span class="chrome__status">
        <span class="chrome__stat">
          <span class="chrome__stat-key">tokens:</span>
          <span class="chrome__stat-val">{{ display.tokens }}</span>
        </span>
        <span class="chrome__stat-sep">·</span>
        <span class="chrome__stat">
          <span class="chrome__stat-key">cost:</span>
          <span class="chrome__stat-val">{{ display.cost }}</span>
        </span>
        <span class="chrome__stat-sep chrome__stat-sep--md">·</span>
        <span class="chrome__stat chrome__stat--md">
          <span class="chrome__stat-key">session:</span>
          <span class="chrome__stat-val">0481</span>
        </span>
        <span class="chrome__stat-sep chrome__stat-sep--lg">·</span>
        <span class="chrome__stat chrome__stat--lg">
          <span class="chrome__stat-key">uptime:</span>
          <span class="chrome__stat-val">12y</span>
        </span>
        <span class="chrome__stat-sep chrome__stat-sep--md">·</span>
        <span class="chrome__stat chrome__stat--md">
          <span class="chrome__stat-key">model:</span>
          <span class="chrome__stat-val">opus-4.7</span>
        </span>
      </span>
    </footer>
  </template>

  <slot />
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { usePrefersReducedMotion } from '../composables/use-prefers-reduced-motion.js'

const route = useRoute()
// Don't render chrome on /print — would pollute PDF output
const active = computed(() => route.name !== 'print')

const reducedMotion = usePrefersReducedMotion()

/* ------------------------------------------------------------------------ *
 * Section -> token/cost mapping. Values are plausible for a real Claude
 * Code session reading the page top-to-bottom. They only ever increase
 * (scrolling up never decrements) — the "max section reached" gates
 * the displayed value.
 * ------------------------------------------------------------------------ */
const STAGES = [
  { sel: '#top', tokens: 47200, cost: 0.12 },
  { sel: '#how-i-work', tokens: 58600, cost: 0.18 },
  { sel: '#bitfinex', tokens: 71300, cost: 0.27 },
  { sel: '#hytale', tokens: 84000, cost: 0.34 },
  { sel: '#aresrpg', tokens: 96700, cost: 0.42 },
  { sel: '#talos', tokens: 109400, cost: 0.51 },
  { sel: '#skills-heading', tokens: 124800, cost: 0.62 },
]

const stageIndex = ref(0)
const animTokens = ref(STAGES[0].tokens)
const animCost = ref(STAGES[0].cost)

const formatTokens = (n) => {
  // 47200 -> "47.2k"
  const k = n / 1000
  return `${k.toFixed(1)}k`
}
const formatCost = (n) => `$${n.toFixed(2)}`

const display = computed(() => ({
  tokens: formatTokens(animTokens.value),
  cost: formatCost(animCost.value),
}))

/* ------------------------------------------------------------------------ *
 * Smooth ramp from current value to target over ~600ms ease-out.
 * Skipped when prefers-reduced-motion (snap to target).
 * ------------------------------------------------------------------------ */
let rafId = null
const animateTo = (targetTokens, targetCost) => {
  if (rafId) cancelAnimationFrame(rafId)

  if (reducedMotion.value) {
    animTokens.value = targetTokens
    animCost.value = targetCost
    return
  }

  const startTokens = animTokens.value
  const startCost = animCost.value
  const startTime = performance.now()
  const duration = 600

  const step = (now) => {
    const t = Math.min(1, (now - startTime) / duration)
    // ease-out cubic
    const eased = 1 - Math.pow(1 - t, 3)
    animTokens.value = startTokens + (targetTokens - startTokens) * eased
    animCost.value = startCost + (targetCost - startCost) * eased
    if (t < 1) rafId = requestAnimationFrame(step)
    else rafId = null
  }
  rafId = requestAnimationFrame(step)
}

/* ------------------------------------------------------------------------ *
 * IntersectionObserver — track which stage section is in view and bump
 * stageIndex up only (monotonic increase).
 * ------------------------------------------------------------------------ */
let observer = null

const mountObserver = () => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window))
    return

  const targets = STAGES
    .map((stage, idx) => {
      const el = document.querySelector(stage.sel)
      return el ? { el, idx } : null
    })
    .filter(Boolean)

  if (!targets.length) return

  const map = new WeakMap()
  for (const t of targets) map.set(t.el, t.idx)

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const idx = map.get(entry.target)
        if (idx == null) continue
        if (idx > stageIndex.value) stageIndex.value = idx
      }
    },
    {
      // Trigger when a section is solidly in view (~30% of viewport)
      rootMargin: '0px 0px -30% 0px',
      threshold: 0.01,
    }
  )

  for (const { el } of targets) observer.observe(el)
}

watch(stageIndex, (idx) => {
  const stage = STAGES[idx]
  if (!stage) return
  animateTo(stage.tokens, stage.cost)
})

onMounted(() => {
  if (!active.value) return
  // Sections render after this component mounts; defer one frame so
  // querySelector finds them.
  requestAnimationFrame(() => requestAnimationFrame(mountObserver))
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
/* ============================================================================
 * Chrome shell — fixed top + bottom bars, content scrolls behind them.
 * Top bar: 44px desktop / 36px mobile
 * Bottom bar: 28px desktop / 24px mobile
 * ============================================================================ */
.chrome {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  font-family: var(--font-mono);
  letter-spacing: var(--track-mono-tight);
  user-select: none;
  pointer-events: none; /* decorative — never blocks content */
  background: var(--color-surface);
  /* tabular numerals so the counter doesn't jitter while animating */
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
}

/* ---- Top bar ---- */
.chrome--top {
  top: 0;
  height: var(--chrome-top-h, 44px);
  padding: 0 14px;
  gap: 12px;
  border-bottom: 1px solid var(--color-line);
  /* Subtle highlight along the top edge — feels like a real window chrome */
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.chrome__lights {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}

.chrome__light {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  /* Inset shadow gives it a little depth without being shouty */
  box-shadow:
    inset 0 0 0 1px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
  /* Desaturate to ~70% so they don't dominate the header */
  filter: saturate(0.7);
}

.chrome__light--red { background: #ff5f56; }
.chrome__light--yellow { background: #ffbd2e; }
.chrome__light--green { background: #27c93f; }

.chrome__title {
  flex: 1 1 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-fg-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* Hide on mobile per spec */
  display: none;
}

.chrome__title-path {
  color: var(--color-fg-dim);
}

.chrome__title-sep,
.chrome__title-at {
  color: var(--color-fg-mute);
  opacity: 0.7;
}

.chrome__title-user {
  color: var(--color-primary);
  opacity: 0.85;
}

.chrome__title-host {
  color: var(--color-fg-dim);
}

.chrome__glyphs {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  flex: 0 0 auto;
  color: var(--color-fg-mute);
  font-size: 13px;
  line-height: 1;
}

.chrome__glyph {
  display: inline-block;
  width: 12px;
  text-align: center;
  opacity: 0.65;
}

/* ---- Bottom (status) bar ---- */
.chrome--bottom {
  bottom: 0;
  height: var(--chrome-bottom-h, 28px);
  padding: 0 14px;
  /* Slightly darker than top bar for terminal-y depth */
  background: color-mix(in oklab, var(--color-surface) 90%, var(--color-bg));
  border-top: 1px solid var(--color-line);
  font-size: 11px;
  color: var(--color-fg-mute);
}

.chrome__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: nowrap;
  overflow: hidden;
  white-space: nowrap;
}

.chrome__stat {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
}

.chrome__stat-key {
  color: var(--color-fg-mute);
  opacity: 0.7;
}

.chrome__stat-val {
  color: var(--color-fg-dim);
}

.chrome__stat-sep {
  color: var(--color-fg-mute);
  opacity: 0.4;
}

/* Hide secondary stats on narrow viewports — keep tokens + cost only */
.chrome__stat--md,
.chrome__stat-sep--md {
  display: none;
}

.chrome__stat--lg,
.chrome__stat-sep--lg {
  display: none;
}

@media (min-width: 480px) {
  .chrome__stat--md,
  .chrome__stat-sep--md {
    display: inline-flex;
  }
  .chrome__stat-sep--md {
    display: inline;
  }
}

@media (min-width: 768px) {
  .chrome__stat--lg,
  .chrome__stat-sep--lg {
    display: inline-flex;
  }
  .chrome__stat-sep--lg {
    display: inline;
  }
  .chrome__title {
    display: inline-flex;
  }
}
</style>
