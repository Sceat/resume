<template>
  <div
    ref="rootRef"
    class="boot-window font-mono text-xs sm:text-sm leading-[1.5] select-none"
    role="log"
    aria-live="polite"
    aria-label="Boot sequence"
    tabindex="0"
    @click="onSkip"
    @keydown="onKeydown"
  >
    <!-- Mac-style traffic lights — match the global terminal chrome (Wave A1) -->
    <div class="boot-window__chrome" aria-hidden="true">
      <span class="boot-window__lights">
        <span class="boot-window__light boot-window__light--red" />
        <span class="boot-window__light boot-window__light--yellow" />
        <span class="boot-window__light boot-window__light--green" />
      </span>
      <span class="boot-window__title">claude-code · boot</span>
    </div>

    <div class="boot-window__body">
      <ol class="space-y-1 m-0 p-0 list-none">
        <li
          v-for="(line, idx) in renderedLines"
          :key="idx"
          class="flex flex-wrap items-baseline gap-2"
        >
          <span class="text-primary">&gt;</span>
          <span>
            <span>{{ line.body }}</span>
            <span v-if="line.tag" :class="line.tagClass">{{ line.tag }}</span>
          </span>
          <span
            v-if="idx === activeIndex && !done"
            class="boot-caret text-primary"
            aria-hidden="true"
          />
          <span
            v-else-if="idx === lines.length - 1 && done && !faded"
            class="boot-caret boot-caret--final text-primary"
            aria-hidden="true"
          />
        </li>
      </ol>
      <p v-if="!done" class="mt-3 text-[10px] sm:text-xs text-fg-mute">
        <span class="opacity-70">[click or press Esc to skip]</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { useBootSession } from '../composables/use-boot-session.js'
import { usePrefersReducedMotion } from '../composables/use-prefers-reduced-motion.js'
import { useTypewriter } from '../composables/use-typewriter.js'

/**
 * Boot sequence — once-per-session ritual paired with the terminal chrome.
 *
 * Behavior:
 *   - First visit       → typewriter animation (~3.0–3.5s), then `complete`.
 *   - Subsequent visits → instant `complete` (gated by localStorage via
 *                         `useBootSession`).
 *   - Reduced motion    → instant render, `complete` after 100ms.
 *   - Skip              → click anywhere on the overlay or press Esc.
 */
const emit = defineEmits(['complete'])

const reduced = usePrefersReducedMotion()
const { seen, markSeen } = useBootSession()
const rootRef = ref(null)

/* ------------------------------------------------------------------------ *
 * Lines — 5 entries. Refined to feel like a real Claude Code session boot,
 * matching the chrome's `~/sceat-portfolio · nox @ opus-4.7` framing.
 * ------------------------------------------------------------------------ */
const lines = [
  { body: 'connecting to claude code...', tag: '', tagClass: '' },
  { body: 'session: 0481 ', tag: '· model: opus-4.7', tagClass: 'text-success' },
  { body: 'loading ~/sceat-portfolio/...', tag: '', tagClass: '' },
  {
    body: '4 flagships indexed ',
    tag: '· 12 sections ready',
    tagClass: 'text-fg-dim',
  },
  { body: 'ready.', tag: '', tagClass: '' },
]

const activeIndex = ref(0)
const done = ref(false)
const faded = ref(false)

/* ------------------------------------------------------------------------ *
 * Typewriters — one per line, spawned lazily as we advance.
 * ------------------------------------------------------------------------ */
const typers = lines.map((line) =>
  useTypewriter({
    text: line.body + (line.tag || ''),
    charDelayMs: 22,
  }),
)

const renderedLines = computed(() =>
  lines.map((line, idx) => {
    if (idx > activeIndex.value)
      return { body: '', tag: '', tagClass: line.tagClass }
    if (idx < activeIndex.value)
      return { ...line }
    const out = typers[idx].output.value
    const body = out.slice(0, line.body.length)
    const tag = out.slice(line.body.length)
    return { body, tag, tagClass: line.tagClass }
  }),
)

/* ------------------------------------------------------------------------ *
 * Sequencing — chain typewriters, fade out after the last one settles.
 * ------------------------------------------------------------------------ */
let watcher = null
let fadeTimer = null
let pauseTimer = null

const clearTimers = () => {
  if (watcher) {
    clearInterval(watcher)
    watcher = null
  }
  if (fadeTimer) {
    clearTimeout(fadeTimer)
    fadeTimer = null
  }
  if (pauseTimer) {
    clearTimeout(pauseTimer)
    pauseTimer = null
  }
}

const finishSequence = () => {
  if (done.value) return
  done.value = true
  // 200ms breath before triggering the parent's fade-out transition
  pauseTimer = setTimeout(() => {
    faded.value = true
    markSeen()
    emit('complete')
  }, 200)
}

const advance = () => {
  if (activeIndex.value < lines.length - 1) {
    activeIndex.value += 1
    typers[activeIndex.value].start()
    watcher = setInterval(() => {
      if (typers[activeIndex.value].complete.value) {
        clearInterval(watcher)
        watcher = null
        advance()
      }
    }, 16)
  } else {
    finishSequence()
  }
}

const startSequence = () => {
  if (reduced.value) {
    for (const t of typers) t.skip()
    activeIndex.value = lines.length - 1
    fadeTimer = setTimeout(() => {
      done.value = true
      faded.value = true
      markSeen()
      emit('complete')
    }, 100)
    return
  }

  typers[0].start()
  watcher = setInterval(() => {
    if (typers[0].complete.value) {
      clearInterval(watcher)
      watcher = null
      advance()
    }
  }, 16)
}

const onSkip = () => {
  if (done.value) return
  clearTimers()
  for (const t of typers) t.skip()
  activeIndex.value = lines.length - 1
  finishSequence()
}

const onKeydown = (event) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    onSkip()
  }
}

const onWindowKey = (event) => {
  if (event.key === 'Escape') onSkip()
}

/* ------------------------------------------------------------------------ *
 * Mount: gate on localStorage first, otherwise observe visibility.
 * ------------------------------------------------------------------------ */
let observer = null
onMounted(() => {
  // Already-seen → skip animation entirely. Emit on next tick so the
  // parent can wire its `bootDone` ref before we fire.
  if (seen.value) {
    activeIndex.value = lines.length - 1
    for (const t of typers) t.skip()
    fadeTimer = setTimeout(() => {
      done.value = true
      faded.value = true
      emit('complete')
    }, 0)
    return
  }

  window.addEventListener('keydown', onWindowKey)

  if (typeof IntersectionObserver === 'undefined') {
    startSequence()
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          observer.disconnect()
          observer = null
          startSequence()
          break
        }
      }
    },
    { threshold: 0.2 },
  )
  if (rootRef.value) observer.observe(rootRef.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onWindowKey)
  clearTimers()
  if (observer) observer.disconnect()
  if (howlInstance) {
    try {
      howlInstance.unload()
    } catch {
      /* swallow */
    }
  }
  if (howlChime) {
    try {
      howlChime.unload()
    } catch {
      /* swallow */
    }
  }
})
</script>

<style scoped>
/* ============================================================================
 * Self-contained terminal window — sits inside the hero's positioning
 * wrapper, but provides its own chrome (traffic lights, gradient hairline
 * border) so it visually echoes the global Wave A1 chrome.
 *
 * Width is constrained here; positioning is owned by the parent (hero.vue,
 * Wave B1) via its absolute wrapper.
 * ============================================================================ */
.boot-window {
  width: 100%;
  max-width: 380px;
  background: color-mix(
    in oklab,
    var(--color-surface) 99%,
    var(--color-primary)
  );
  border-radius: 6px;
  overflow: hidden;
  outline: none;
  /* 1px gradient hairline border via padding-box + gradient background */
  position: relative;
  box-shadow:
    0 8px 24px -12px rgba(0, 0, 0, 0.8),
    0 0 0 1px color-mix(in oklab, var(--color-primary) 18%, transparent);
}

.boot-window::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 6px;
  padding: 1px;
  background: var(--gradient-cyan-sky);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.55;
}

.boot-window:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* ---- Chrome bar (mac-style traffic lights) ---- */
.boot-window__chrome {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 24px;
  padding: 0 10px;
  background: color-mix(in oklab, var(--color-surface) 92%, var(--color-bg));
  border-bottom: 1px solid
    color-mix(in oklab, var(--color-line) 80%, transparent);
}

.boot-window__lights {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.boot-window__light {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  box-shadow:
    inset 0 0 0 1px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
  filter: saturate(0.7);
}

.boot-window__light--red { background: #ff5f56; }
.boot-window__light--yellow { background: #ffbd2e; }
.boot-window__light--green { background: #27c93f; }

.boot-window__title {
  font-size: 10px;
  letter-spacing: var(--track-mono-tight, 0);
  color: var(--color-fg-mute);
  opacity: 0.75;
}

/* ---- Body ---- */
.boot-window__body {
  padding: 12px 14px 14px;
}

/* ---- Caret ---- */
.boot-caret {
  display: inline-block;
  width: 0.55em;
  height: 1em;
  vertical-align: -0.15em;
  background: currentColor;
  margin-left: 2px;
  animation: boot-caret-blink 1s steps(2) infinite;
}

.boot-caret--final {
  /* Pulse ~600ms after the last line, then fade out — handled by the
     parent's leave transition; here we just slow the blink. */
  animation: boot-caret-blink 0.9s steps(2) 1;
  opacity: 0.85;
}

@keyframes boot-caret-blink {
  0%, 50% { opacity: 1; }
  50.01%, 100% { opacity: 0; }
}

/* Reduced motion — kill caret blink, keep visibility */
@media (prefers-reduced-motion: reduce) {
  .boot-caret {
    animation: none;
    opacity: 1;
  }
}
</style>
