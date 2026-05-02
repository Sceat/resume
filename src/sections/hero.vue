<template>
  <section
    id="top"
    ref="sectionRef"
    class="hero-section scanlines relative isolate"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <!-- Ambient curl-noise field — protagonist of the background -->
    <HeroShader :mouse-x="mouseX" :mouse-y="mouseY" />

    <!-- Pixel-life: carbon grid + hex glyph rain + tx packets + commit pulses -->
    <HeroPixelLife :mouse-x="mouseX" :mouse-y="mouseY" />

    <!-- Ghost agents — distant Claudes in the background haze.
         Different from the foreground exercise mascot: one walks, one jumps. -->
    <div class="hero-ghost hero-ghost--left" aria-hidden="true">
      <MascotLoop
        :svg-markup="walkMarkup"
        :frame-count="8"
        :frame-duration="0.10"
        :size="72"
        :start-frame="3"
      />
    </div>
    <div class="hero-ghost hero-ghost--right" aria-hidden="true">
      <MascotLoop
        :svg-markup="jumpMarkup"
        :frame-count="9"
        :frame-duration="0.12"
        :size="56"
        :start-frame="0"
      />
    </div>

    <!-- Bottom fade so the hero blends into the next section -->
    <div
      class="absolute inset-x-0 bottom-0 h-40 -z-[6] bg-gradient-to-b from-transparent to-[var(--color-bg)]"
      aria-hidden="true"
    />

    <!-- Boot sequence — pinned top-right, dismisses itself -->
    <Transition name="boot-fade">
      <div
        v-if="!bootDone"
        class="hero-boot surface"
        aria-label="Boot sequence container"
      >
        <BootSequence @complete="onBootComplete" />
      </div>
    </Transition>

    <!-- Stage: golden split, simplified composition -->
    <div ref="stageRef" class="hero-stage">
      <!-- Minimal masthead — single line, single rule -->
      <header class="hero-masthead" aria-hidden="true">
        <span class="hero-masthead__index">// session {{ session }} · ~/dev/portfolio</span>
        <span class="hero-masthead__rule" />
      </header>

      <div class="hero-grid">
        <!-- LEFT RAIL · 61.8% — headline + meta + CTAs + shipping -->
        <div class="hero-major">
          <h1
            class="hero-wall"
            aria-label="Senior fullstack engineer. Building on-chain games on Sui."
          >
            <span class="hero-wall__line hero-wall__line--one">
              <span class="hero-wall__chunk hero-wall__chunk--solid">Senior fullstack</span>
            </span>
            <span class="hero-wall__line hero-wall__line--two">
              <span class="hero-wall__chunk hero-wall__chunk--thin">engineer.</span>
            </span>
            <span class="hero-wall__line hero-wall__line--three">
              <span class="hero-wall__chunk hero-wall__chunk--solid">Building on-chain</span>
            </span>
            <span class="hero-wall__line hero-wall__line--four">
              <span class="hero-wall__chunk hero-wall__chunk--thin">games on </span>
              <span class="hero-wall__chunk hero-wall__chunk--accent text-gradient-hero">Sui.</span>
            </span>
          </h1>

          <!-- Meta line — pill + caption + thin rule -->
          <div class="hero-meta">
            <span class="pill-status hero-meta__pill">
              <span class="pill-status__dot" aria-hidden="true" />
              available · remote
            </span>
            <span class="hero-meta__rule" aria-hidden="true" />
            <span class="hero-meta__caption">
              12y shipping · ex-Bitfinex · Move + TS + K8s
            </span>
          </div>

          <!-- CTA row -->
          <div class="hero-ctas">
            <a
              :href="`mailto:${profile.email}`"
              class="btn-terminal btn-terminal-primary hero-cta-primary"
            >
              <span>hire me</span>
              <Icon name="arrow-right" :size="14" />
            </a>
            <a
              href="/001-CYRIL-MORLET-RESUME.pdf"
              download
              class="btn-terminal btn-terminal-ghost hero-cta-ghost"
            >
              <Icon name="download" :size="14" />
              <span>resume.pdf</span>
            </a>
          </div>

          <!-- Now-shipping panel — replaces the spec card stack -->
          <div class="hero-shipping" aria-label="Currently shipping">
            <span class="hero-shipping__eyebrow">// now shipping</span>
            <ul class="hero-shipping__list">
              <li class="hero-shipping__row">
                <span class="hero-shipping__dot" aria-hidden="true" />
                <span class="hero-shipping__name">hytale-mmorpg</span>
                <span class="hero-shipping__sep">·</span>
                <span class="hero-shipping__status">live</span>
                <span class="hero-shipping__sep">·</span>
                <span class="hero-shipping__meta">1.3k players</span>
              </li>
              <li class="hero-shipping__row">
                <span class="hero-shipping__dot hero-shipping__dot--wip" aria-hidden="true" />
                <span class="hero-shipping__name">aresrpg</span>
                <span class="hero-shipping__sep">·</span>
                <span class="hero-shipping__status hero-shipping__status--wip">building</span>
                <span class="hero-shipping__sep">·</span>
                <span class="hero-shipping__meta">onchain mmorpg</span>
              </li>
              <li class="hero-shipping__row">
                <span class="hero-shipping__dot" aria-hidden="true" />
                <span class="hero-shipping__name">talos</span>
                <span class="hero-shipping__sep">·</span>
                <span class="hero-shipping__status">prod</span>
                <span class="hero-shipping__sep">·</span>
                <span class="hero-shipping__meta">33 helm releases</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- RIGHT RAIL · 38.2% — agent tank -->
        <aside class="hero-minor" aria-label="Agent">
          <AgentTank :tilt="tilt" />
        </aside>
      </div>
    </div>

    <!-- Scroll hint -->
    <a
      v-if="bootDone"
      href="#how-i-work"
      class="scroll-explore hero-scroll-pos"
      aria-label="Scroll to next section"
    >
      <span class="scroll-explore__arrow" aria-hidden="true">↓</span>
      <span>explore</span>
      <span class="scroll-explore__cursor" aria-hidden="true" />
    </a>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import AgentTank from '../components/agent-tank.vue'
import BootSequence from '../components/boot-sequence.vue'
import HeroPixelLife from '../components/hero-pixel-life.vue'
import HeroShader from '../components/hero-shader.vue'
import Icon from '../components/icon.vue'
import MascotLoop from '../components/mascot-loop.vue'

import walkMarkup from '../assets/mascot/clawd-walk.svg?raw'
import jumpMarkup from '../assets/mascot/clawd-jump.svg?raw'
import { profile } from '../content/profile.js'
import { usePrefersReducedMotion } from '../composables/use-prefers-reduced-motion.js'

const bootDone = ref(false)
const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1280)
const reduced = usePrefersReducedMotion()

const sectionRef = ref(null)
const stageRef = ref(null)

const isDesktop = computed(() => viewportWidth.value >= 768)

// Pseudo-session id rotated daily so it feels alive across visits
const session = (() => {
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  return day.slice(-4)
})()

const onBootComplete = () => {
  bootDone.value = true
}

// ─── Cursor wiring — drives both the AgentTank tilt and the OGL shader ──
// mouseX/mouseY are 0..1 across the section (for the shader)
// tilt is -1..1 across the right column (for the mascot)
const mouseX = ref(0.5)
const mouseY = ref(0.5)
const tilt = ref(0)

const onPointerMove = (event) => {
  if (!isDesktop.value) return
  if (event.pointerType && event.pointerType !== 'mouse') return
  if (!sectionRef.value) return
  const rect = sectionRef.value.getBoundingClientRect()
  // section-relative UV (0..1)
  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height
  mouseX.value = Math.max(0, Math.min(1, x))
  mouseY.value = Math.max(0, Math.min(1, y))
  if (reduced.value) return
  // tilt — relative to the right column center
  // we approximate: right column starts at ~62% of the section width
  const tankCenterX = rect.left + rect.width * 0.81
  const dx = (event.clientX - tankCenterX) / (rect.width * 0.19)
  tilt.value = Math.max(-1, Math.min(1, dx))
}

const onPointerLeave = () => {
  mouseX.value = 0.5
  mouseY.value = 0.5
  tilt.value = 0
}

const onResize = () => {
  viewportWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', onResize, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
/* ============================================================================
 * Hero v5 — "The Living Agent"
 * Simplified type, OGL shader background, agent tank as the focal point.
 * Calmer than v4, more alive: the mascot IS the hero.
 * ============================================================================ */

.hero-section {
  overflow-x: clip;
  overflow-y: visible;
  min-height: 100svh;
  position: relative;
}

@media (max-width: 879px) {
  .hero-section {
    /* Clip both axes on mobile — the AgentTank's halo + orbital glyphs
     * orbit at radii up to 200px which can overhang the column when the
     * hero stacks vertically. */
    overflow: hidden;
  }
}

.hero-boot {
  position: absolute;
  top: 5rem;
  right: 1rem;
  z-index: 20;
  max-width: 280px;
  padding: 0.75rem;
  border-radius: 2px;
  box-shadow: 0 8px 24px -12px rgba(0, 0, 0, 0.8);
}

@media (min-width: 640px) {
  .hero-boot {
    top: 6rem;
    right: 1.5rem;
  }
}

@media (max-width: 767px) {
  .hero-boot {
    top: 4.5rem;
    right: 0.75rem;
    left: 0.75rem;
    max-width: none;
  }
}

/* --------------------------------------------------------------------------
 * Stage
 * -------------------------------------------------------------------------- */
.hero-stage {
  position: relative;
  z-index: 5;
  min-height: 100svh;
  max-width: 1440px;
  margin: 0 auto;
  padding: clamp(2.5rem, 7vh, 4.5rem) clamp(1.5rem, 5vw, 4.5rem)
    clamp(3rem, 8vh, 5rem);
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3.5vh, 2.5rem);
}

/* --------------------------------------------------------------------------
 * MASTHEAD — single line, single thin rule below
 * -------------------------------------------------------------------------- */
.hero-masthead {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-fg-mute);
  z-index: 5;
}

.hero-masthead__index {
  flex: 0 0 auto;
  white-space: nowrap;
  color: var(--color-fg-mute);
  opacity: 0.7;
}

.hero-masthead__rule {
  flex: 1 1 auto;
  height: 1px;
  background: linear-gradient(
    to right,
    color-mix(in oklab, var(--color-fg-mute) 40%, transparent),
    transparent
  );
}

@media (max-width: 767px) {
  .hero-masthead {
    font-size: 0.625rem;
    letter-spacing: 0.14em;
  }
}

/* --------------------------------------------------------------------------
 * GRID — golden split. Right column gets aligned to vertical center.
 * -------------------------------------------------------------------------- */
.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(2rem, 5vh, 3rem);
  flex: 1 1 auto;
  align-items: stretch;
}

@media (min-width: 880px) {
  .hero-grid {
    grid-template-columns: minmax(0, 1.618fr) minmax(0, 1fr);
    gap: clamp(2rem, 4vw, 4rem);
    align-items: center;
  }
}

/* --------------------------------------------------------------------------
 * LEFT RAIL
 * -------------------------------------------------------------------------- */
.hero-major {
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 3vh, 2rem);
  z-index: 5;
}

/* JetBrains Mono headline — terminal voice across the whole site,
   no italic (mono italics read as off), weight + opacity carry hierarchy. */
.hero-wall {
  position: relative;
  display: block;
  margin: 0;
  padding: 0;
  font-family: var(--font-mono);
  line-height: 1;
  /* Mono cells are wider than sans — keep size tighter so letters don't feel airy.
     Tracking pulled aggressively negative to compensate for monospace advance. */
  font-size: min(clamp(1.625rem, 3.4vw, 3rem), 7vh);
  letter-spacing: -0.10em;
  color: var(--color-fg);
  font-feature-settings: 'zero', 'ss01', 'cv11';
}

.hero-wall__line {
  display: block;
  white-space: normal;
}

.hero-wall__line--one {
  font-weight: 700;
  letter-spacing: -0.115em;
}

.hero-wall__line--two {
  font-weight: 400;
  color: var(--color-fg-dim);
  margin-top: 0.1em;
  padding-left: clamp(0.75rem, 2.5vw, 2rem);
  letter-spacing: -0.085em;
  opacity: 0.85;
}

.hero-wall__line--three {
  font-weight: 700;
  letter-spacing: -0.115em;
  margin-top: 0.55em;
}

.hero-wall__line--four {
  font-weight: 400;
  color: var(--color-fg-dim);
  margin-top: 0.1em;
  padding-left: clamp(0.75rem, 2.5vw, 2rem);
  letter-spacing: -0.085em;
  opacity: 0.85;
}

.hero-wall__chunk {
  display: inline;
}

.hero-wall__chunk--solid {
  color: var(--color-fg);
}

.hero-wall__chunk--thin {
  font-weight: 400;
  color: var(--color-fg-mute);
  opacity: 0.85;
}

.hero-wall__chunk--accent {
  font-weight: 700;
  opacity: 1;
}

/* --- Meta line --- */
.hero-meta {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  flex-wrap: wrap;
}

.hero-meta__rule {
  flex: 0 0 32px;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    color-mix(in oklab, var(--color-line) 100%, transparent) 50%,
    transparent
  );
}

.hero-meta__caption {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--color-fg-dim);
  letter-spacing: -0.005em;
}

@media (max-width: 639px) {
  .hero-meta__rule {
    display: none;
  }
}

/* --- CTAs --- */
.hero-ctas {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.hero-cta-primary {
  font-size: 0.8125rem;
  padding: 0.625rem 1rem;
}

.hero-cta-ghost {
  font-size: 0.75rem;
  padding: 0.625rem 0.875rem;
}

/* --- Now shipping panel --- */
.hero-shipping {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px dashed color-mix(in oklab, var(--color-fg-mute) 25%, transparent);
}

.hero-shipping__eyebrow {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-fg-mute);
}

.hero-shipping__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.hero-shipping__row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--color-fg-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hero-shipping__dot {
  flex: 0 0 auto;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--color-success);
  box-shadow: 0 0 8px color-mix(in oklab, var(--color-success) 60%, transparent);
}

.hero-shipping__dot--wip {
  background: #f59e0b;
  box-shadow: 0 0 8px color-mix(in oklab, #f59e0b 60%, transparent);
}

.hero-shipping__name {
  color: var(--color-fg);
}

.hero-shipping__sep {
  color: var(--color-fg-mute);
  opacity: 0.6;
}

.hero-shipping__status {
  color: var(--color-success);
}

.hero-shipping__status--wip {
  color: #f59e0b;
}

.hero-shipping__meta {
  color: var(--color-fg-mute);
}

@media (max-width: 639px) {
  .hero-shipping__row {
    font-size: 0.75rem;
    flex-wrap: wrap;
    white-space: normal;
  }
}

/* --------------------------------------------------------------------------
 * RIGHT RAIL — agent tank fills the column
 * -------------------------------------------------------------------------- */
.hero-minor {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 480px;
  z-index: 5;
}

@media (max-width: 879px) {
  .hero-minor {
    min-height: 360px;
  }
}

/* --------------------------------------------------------------------------
 * MOBILE
 * -------------------------------------------------------------------------- */
@media (max-width: 879px) {
  .hero-stage {
    padding-top: clamp(5rem, 14vh, 8rem);
    padding-bottom: 6rem;
  }

  .hero-wall {
    font-size: clamp(2.75rem, 11vw, 4.75rem);
  }

  .hero-wall__line--two,
  .hero-wall__line--four {
    padding-left: 1.25rem;
  }
}

/* --------------------------------------------------------------------------
 * GHOST AGENTS — distant Claudes in the background haze
 * Sit between the pixel-life layer (z:-8) and the content (z:5). Low opacity
 * so they read as "other agents working" rather than competing with the
 * foreground AgentTank.
 * -------------------------------------------------------------------------- */
.hero-ghost {
  position: absolute;
  pointer-events: none;
  z-index: -7;
  opacity: 0.18;
  filter: saturate(0.4) blur(0.4px);
  mix-blend-mode: screen;
}

.hero-ghost--left {
  top: clamp(8rem, 18vh, 14rem);
  left: clamp(2vw, 6vw, 6rem);
  transform: rotate(-4deg);
}

.hero-ghost--right {
  bottom: clamp(6rem, 14vh, 9rem);
  left: clamp(28vw, 32vw, 36vw);
  transform: rotate(2deg) scaleX(-1);
  opacity: 0.13;
}

@media (max-width: 879px) {
  /* On mobile both ghosts are dropped — there's no horizontal margin to
   * hide them in, so they ended up bleeding under hero text instead of
   * floating in the gutter. The foreground AgentTank carries enough
   * mascot weight on small screens. */
  .hero-ghost--right,
  .hero-ghost--left {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-ghost { opacity: 0.10; }
}

/* Position scroll hint at bottom-center of hero */
.hero-scroll-pos {
  position: absolute;
  bottom: 1.75rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

/* Boot fade-out */
.boot-fade-leave-active {
  transition: opacity 360ms ease, transform 360ms ease;
}
.boot-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
