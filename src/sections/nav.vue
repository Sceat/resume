<template>
  <header
    :class="[
      'site-nav fixed top-0 left-0 right-0 z-40 transition-all',
      scrolled ? 'site-nav--scrolled' : 'site-nav--top',
    ]"
  >
    <nav
      :class="[
        'site-nav__inner mx-auto flex items-center',
        scrolled ? 'site-nav__inner--pill' : 'site-nav__inner--top',
      ]"
      aria-label="Primary"
    >
      <!-- Left: prompt -->
      <a
        href="#top"
        class="nav-prompt"
        @click.prevent="scrollTo('#top')"
      >
        <span class="nav-prompt__bracket">[</span><span class="nav-prompt__path">~/sceat</span><span class="nav-prompt__bracket nav-prompt__bracket--right">]</span>
      </a>

      <!-- Center cluster: links separated by mono dot. Desktop only. -->
      <ul v-if="!isMobile" class="site-nav__center">
        <template v-for="(link, i) in links" :key="link.href">
          <li>
            <a
              :href="link.href"
              class="nav-link"
              @click.prevent="scrollTo(link.href)"
            >
              {{ link.label }}
            </a>
          </li>
          <li
            v-if="i < links.length - 1"
            class="site-nav__sep"
            aria-hidden="true"
          >
            ·
          </li>
        </template>
      </ul>

      <!-- Right: hire-me + status dot. Desktop only. -->
      <div v-if="!isMobile" class="site-nav__right">
        <span class="site-nav__status" aria-label="available for hire">
          <span class="site-nav__status-dot" />
          <span class="site-nav__status-label">available</span>
        </span>
        <a
          ref="hireBtn"
          :href="`mailto:${profile.email}`"
          class="btn-terminal btn-terminal-primary nav-hire"
          @mousemove="onMagnet"
          @mouseleave="onMagnetReset"
        >
          <span>hire me</span>
        </a>
      </div>

      <!-- Mobile-only: [ menu ] pill that opens the Cmd+K palette -->
      <button
        v-if="isMobile"
        type="button"
        class="btn-terminal nav-menu-pill"
        aria-label="Open command menu"
        @click="openPalette"
      >
        <span>menu</span>
      </button>
    </nav>
  </header>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { profile } from '../content/profile.js'
import { usePrefersReducedMotion } from '../composables/use-prefers-reduced-motion.js'
import { useCommandPalette } from '../composables/use-command-palette.js'

const links = [
  { label: 'about', href: '#about' },
  { label: 'flagships', href: '#flagships' },
  { label: 'more', href: '#more' },
  { label: 'skills', href: '#skills' },
  { label: 'contact', href: '#contact' },
]

const hireBtn = ref(null)
const scrolled = ref(false)
const isMobile = ref(false)
const reduced = usePrefersReducedMotion()
const palette = useCommandPalette()

const MOBILE_BREAKPOINT = 768

const scrollTo = (hash) => {
  if (hash === '#top') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const el = document.querySelector(hash)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const openPalette = () => {
  palette.open()
}

const onScroll = () => {
  scrolled.value = window.scrollY > 80
}

let mql = null

const updateBreakpoint = (event) => {
  isMobile.value = event.matches
}

const setupBreakpoint = () => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    isMobile.value = false
    return
  }
  mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  isMobile.value = mql.matches
  if (mql.addEventListener) mql.addEventListener('change', updateBreakpoint)
  else mql.addListener(updateBreakpoint)
}

const teardownBreakpoint = () => {
  if (!mql) return
  if (mql.removeEventListener) mql.removeEventListener('change', updateBreakpoint)
  else mql.removeListener(updateBreakpoint)
  mql = null
}

/* Magnetic cursor pull on the hire button (subtle 4-6px). */
const onMagnet = (event) => {
  if (reduced.value || !hireBtn.value) return
  const rect = hireBtn.value.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const dx = (event.clientX - cx) * 0.18
  const dy = (event.clientY - cy) * 0.18
  const max = 5
  const clamp = (v) => Math.max(-max, Math.min(max, v))
  hireBtn.value.style.setProperty('--btn-mx', `${clamp(dx).toFixed(2)}px`)
  hireBtn.value.style.setProperty('--btn-my', `${clamp(dy).toFixed(2)}px`)
}

const onMagnetReset = () => {
  if (!hireBtn.value) return
  hireBtn.value.style.setProperty('--btn-mx', '0px')
  hireBtn.value.style.setProperty('--btn-my', '0px')
}

onMounted(() => {
  setupBreakpoint()
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  teardownBreakpoint()
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
/* ─── Seamless nav: no hard background, no border ─── */
.site-nav {
  pointer-events: none;
  transition: padding var(--dur-slow) var(--ease-out-expo);
}

.site-nav > * {
  pointer-events: auto;
}

.site-nav--top {
  padding-block: 0;
  background: linear-gradient(
    to bottom,
    color-mix(in oklab, var(--color-bg) 65%, transparent) 0%,
    color-mix(in oklab, var(--color-bg) 35%, transparent) 60%,
    transparent 100%
  );
  backdrop-filter: blur(0.5px);
}

.site-nav--scrolled {
  padding-block: 1.5rem;
  background: transparent;
  backdrop-filter: none;
}

/* Default top layout: prompt left, links centered, hire right */
.site-nav__inner--top {
  width: 100%;
  max-width: 80rem;
  height: 4rem;
  padding-inline: 1rem;
  justify-content: space-between;
  position: relative;
}

@media (min-width: 640px) {
  .site-nav__inner--top {
    padding-inline: 1.5rem;
  }
}

/* ─── Shapeless nav: gradient haze, fading edges, no frame. ───────────
 * No clip-path, no border, no border-radius. The bar is a soft pool of
 * legibility that *fades* into the page on both sides — readable without
 * being a "container". Two pseudo-layers handle the look:
 *
 *   ::before — backdrop-blur veil masked with a horizontal soft edge
 *              (radial alpha falloff). Gives the text contrast against
 *              the busy hero, but the panel has no visible boundary.
 *   ::after  — single 1px cyan accent line beneath the text, fading
 *              to transparent at both ends. The only "edge" in the bar.
 *
 * Hire-me reverts to the sharp 1px terminal button so the whole nav is
 * just text + button floating in the page — no pill, no octagon. */
.site-nav__inner--pill {
  width: min(calc(100% - 1.5rem), 580px);
  height: 3rem;
  padding: 0 0.5rem 0 1rem;
  justify-content: space-between;
  position: relative;
  isolation: isolate;
  background: transparent;
  border: 0;
  border-radius: 0;
}

/* Soft haze backdrop — masked horizontally so the nav fades at edges. */
.site-nav__inner--pill::before {
  content: '';
  position: absolute;
  inset: -4px -8px;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse 70% 110% at 50% 50%,
      color-mix(in oklab, var(--color-surface) 65%, transparent) 0%,
      color-mix(in oklab, var(--color-surface) 30%, transparent) 55%,
      transparent 100%
    ),
    radial-gradient(
      ellipse 90% 60% at 50% 0%,
      color-mix(in oklab, var(--color-primary) 6%, transparent) 0%,
      transparent 70%
    );
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  /* Soft horizontal fade so nothing reads as an outline. */
  -webkit-mask: linear-gradient(
    to right,
    transparent 0%,
    black 18%,
    black 82%,
    transparent 100%
  );
  mask: linear-gradient(
    to right,
    transparent 0%,
    black 18%,
    black 82%,
    transparent 100%
  );
}

/* Single fading accent line — the only "edge" in the bar. */
.site-nav__inner--pill::after {
  content: '';
  position: absolute;
  left: 6%;
  right: 6%;
  bottom: 0;
  height: 1px;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(
    to right,
    transparent 0%,
    color-mix(in oklab, var(--color-primary) 35%, transparent) 30%,
    color-mix(in oklab, var(--color-primary-glow) 45%, transparent) 50%,
    color-mix(in oklab, var(--color-primary) 35%, transparent) 70%,
    transparent 100%
  );
  filter: drop-shadow(0 0 4px color-mix(in oklab, var(--color-primary) 35%, transparent));
  opacity: 0.7;
  animation: nav-line-shift 16s ease-in-out infinite;
}

@keyframes nav-line-shift {
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 0.85; }
}

@media (prefers-reduced-motion: reduce) {
  .site-nav__inner--pill::after { animation: none; opacity: 0.65; }
}

/* ─── Center cluster (desktop links + dot separators) ─── */
.site-nav__center {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.site-nav__inner--pill .site-nav__center {
  position: static;
  transform: none;
  gap: 0.5rem;
}

.site-nav__sep {
  font-family: var(--font-mono);
  font-size: var(--text-mono-sm);
  color: var(--color-fg-mute);
  user-select: none;
  opacity: 0.55;
  line-height: 1;
}

/* ─── Right cluster (status dot + hire-me) ─── */
.site-nav__right {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.site-nav__inner--pill .site-nav__right {
  gap: 0.5rem;
}

.site-nav__status {
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
  font-family: var(--font-mono);
  font-size: var(--text-mono-2xs);
  letter-spacing: var(--track-mono-wide);
  text-transform: uppercase;
  color: var(--color-success);
}

.site-nav__inner--pill .site-nav__status-label {
  display: none;
}

.site-nav__status-dot {
  display: inline-block;
  width: 0.4375rem;
  height: 0.4375rem;
  border-radius: 999px;
  background: var(--color-success);
  box-shadow: 0 0 8px var(--color-success);
  animation: terminal-blink 2.4s steps(2) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .site-nav__status-dot {
    animation: none;
  }
}

.nav-hire {
  padding: 0.5rem 0.875rem;
  font-size: var(--text-mono-xs);
  text-transform: uppercase;
  letter-spacing: var(--track-mono-wide);
}

/* In-pill HIRE ME keeps the same sharp terminal rim used elsewhere. The
 * surrounding nav has no shape now, so the button just floats with the
 * rest of the page's terminal-rim language. */
.site-nav__inner--pill .nav-hire {
  padding: 0.4375rem 0.875rem;
}

/* ─── Mobile [ menu ] pill ─── */
.nav-menu-pill {
  margin-left: auto;
  padding: 0.5rem 0.875rem;
  font-size: var(--text-mono-xs);
  text-transform: uppercase;
  letter-spacing: var(--track-mono-wide);
}
</style>
