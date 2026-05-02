<template>
  <article :class="['project-card', `project-card--${variant}`]">
    <span
      :class="['pill-status', `pill-status--${statusKey}`]"
      :data-status="statusKey"
    >
      <span class="pill-status__dot" aria-hidden="true" />
      {{ project.status }}
    </span>

    <header class="project-card__head">
      <h3 class="project-card__name">{{ project.name }}</h3>
      <span v-if="project.year" class="project-card__year">{{ project.year }}</span>
    </header>

    <p class="project-card__tagline">{{ project.tagline }}</p>

    <ul class="project-card__stack" aria-label="Tech stack">
      <li v-for="tech in visibleStack" :key="tech">
        <SkillPill :name="tech" />
      </li>
      <li v-if="overflowStack > 0">
        <SkillPill :name="`+${overflowStack}`" />
      </li>
    </ul>

    <div v-if="project.proof?.suiscan" class="project-card__address">
      <button
        type="button"
        class="project-card__address-btn"
        :aria-label="`Copy deployed address ${project.proof.suiscan}`"
        @click="copyAddress"
      >
        <code>{{ truncatedAddress }}</code>
        <span class="project-card__copy" aria-hidden="true">
          {{ copied ? 'copied ✓' : 'copy' }}
        </span>
      </button>
    </div>

    <a
      v-if="primaryLink"
      :href="primaryLink.href"
      target="_blank"
      rel="noreferrer noopener"
      class="btn-terminal-link project-card__link"
    >
      {{ primaryLink.label }}
    </a>

    <p
      v-if="variant === 'personal' && project.lesson"
      class="project-card__lesson"
    >
      → taught me {{ project.lesson }}
    </p>
  </article>
</template>

<script setup>
import { computed } from 'vue'

import { useClipboard } from '../composables/use-clipboard.js'

import SkillPill from './skill-pill.vue'

const props = defineProps({
  /** @type {import('vue').PropType<import('../content/schema').Project>} */
  project: { type: Object, required: true },
  /** Cap visible stack chips before showing +N overflow */
  maxStack: { type: Number, default: 4 },
  /**
   * Layout variant.
   * - 'personal'   (default) full layout with optional lesson line + thumbnail
   * - 'employment' compact layout, no lesson line
   */
  variant: {
    type: String,
    default: 'personal',
    validator: (v) => ['personal', 'employment'].includes(v),
  },
})

const { copy, copied } = useClipboard()

const visibleStack = computed(() => props.project.stack.slice(0, props.maxStack))
const overflowStack = computed(() =>
  Math.max(0, props.project.stack.length - props.maxStack),
)

const statusKey = computed(() => {
  const s = props.project.status.toLowerCase()
  if (s.includes('testnet') || s.includes('prototyping')) return 'warn'
  if (s.includes('archived') || s.includes('past')) return 'mute'
  if (s.includes('maintained') || s.includes('live') || s.includes('active') || s.includes('production'))
    return 'success'
  return 'mute'
})

const truncatedAddress = computed(() => {
  const addr = props.project.proof?.suiscan
  if (!addr) return ''
  if (addr.length <= 14) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
})

const primaryLink = computed(() => {
  if (props.project.link) return { href: props.project.link, label: 'open' }
  if (props.project.proof?.github)
    return { href: props.project.proof.github, label: 'github' }
  if (props.project.proof?.npm) return { href: props.project.proof.npm, label: 'npm' }
  if (props.project.proof?.suiscan)
    return {
      href: `https://suiscan.xyz/testnet/object/${props.project.proof.suiscan}`,
      label: 'suiscan',
    }
  return null
})

const copyAddress = () => {
  if (props.project.proof?.suiscan) copy(props.project.proof.suiscan)
}
</script>

<style scoped>
.project-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 1rem 1.125rem 1.125rem;
  background: color-mix(in oklab, var(--color-surface) 70%, transparent);
  backdrop-filter: blur(20px) saturate(1.5);
  -webkit-backdrop-filter: blur(20px) saturate(1.5);
  border: 1px solid var(--color-line);
  border-radius: 10px;
  isolation: isolate;
  overflow: hidden;
  transition:
    transform var(--dur-normal) var(--ease-out-expo),
    border-color var(--dur-normal) var(--ease-out-expo),
    box-shadow var(--dur-normal) var(--ease-out-expo),
    background var(--dur-normal) var(--ease-out-expo);
}

.project-card::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at 100% 0%,
    color-mix(in oklab, var(--color-primary) 6%, transparent) 0%,
    transparent 60%
  );
  opacity: 0;
  transition: opacity var(--dur-normal) var(--ease-standard);
  z-index: -1;
}

.project-card:hover {
  transform: translateY(-2px) scale(1.01);
  border-color: color-mix(in oklab, var(--color-primary) 45%, var(--color-line));
  background: color-mix(in oklab, var(--color-surface-2) 75%, transparent);
  box-shadow:
    0 12px 28px -16px rgba(0, 0, 0, 0.6),
    0 0 24px -8px color-mix(in oklab, var(--color-primary) 40%, transparent);
}

.project-card:hover::before {
  opacity: 1;
}

/* Status pill positioned at top-right */
.project-card .pill-status {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 1;
}

/* Status pill colour modifiers — overrides .pill-status defaults */
.pill-status--warn {
  color: var(--color-warn);
  background: color-mix(in oklab, var(--color-warn) 6%, transparent);
  border-color: color-mix(in oklab, var(--color-warn) 28%, transparent);
  box-shadow:
    inset 0 0 0 1px color-mix(in oklab, var(--color-warn) 6%, transparent),
    0 0 24px -10px color-mix(in oklab, var(--color-warn) 40%, transparent);
}

.pill-status--mute {
  color: var(--color-fg-mute);
  background: color-mix(in oklab, var(--color-fg-mute) 6%, transparent);
  border-color: color-mix(in oklab, var(--color-fg-mute) 28%, transparent);
  box-shadow: none;
}

.project-card__head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  /* leave room for absolute status pill */
  padding-right: 5.5rem;
}

.project-card__name {
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: var(--track-h3);
  color: var(--color-fg);
}

.project-card__year {
  font-family: var(--font-mono);
  font-size: var(--text-mono-2xs);
  letter-spacing: var(--track-mono-wide);
  color: var(--color-fg-mute);
}

.project-card__tagline {
  font-family: var(--font-mono);
  font-size: var(--text-mono-sm);
  color: var(--color-fg-dim);
  line-height: 1.5;
}

.project-card__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.project-card__address {
  margin-top: 0.125rem;
}

.project-card__address-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3125rem 0.625rem;
  font-family: var(--font-mono);
  font-size: var(--text-mono-xs);
  color: var(--color-primary);
  background: color-mix(in oklab, var(--color-primary) 8%, var(--color-surface-2));
  border: 1px dashed color-mix(in oklab, var(--color-primary) 40%, var(--color-line));
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color var(--dur-fast) var(--ease-standard),
    border-color var(--dur-fast) var(--ease-standard),
    transform var(--dur-fast) var(--ease-out-expo);
}

.project-card__address-btn:hover {
  background: color-mix(in oklab, var(--color-primary) 14%, var(--color-surface-2));
  border-color: var(--color-primary);
}

.project-card__address-btn:active {
  transform: scale(0.98);
}

.project-card__address-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
}

.project-card__copy {
  font-size: var(--text-mono-2xs);
  color: var(--color-fg-mute);
  letter-spacing: var(--track-mono-wide);
  text-transform: uppercase;
}

.project-card__link {
  align-self: flex-start;
  margin-top: auto;
  padding-top: 0.25rem;
}

.project-card__lesson {
  margin-top: 0.5rem;
  padding-top: 0.625rem;
  border-top: 1px dashed var(--hairline);
  font-family: var(--font-mono);
  font-size: var(--text-mono-xs);
  color: var(--color-fg-mute);
  line-height: 1.5;
}

/* Employment variant — slimmer, no lesson */
.project-card--employment {
  background: transparent;
  border-color: var(--hairline);
}

@media (prefers-reduced-motion: reduce) {
  .project-card,
  .project-card:hover {
    transform: none;
    transition-duration: var(--dur-instant);
  }
}
</style>
