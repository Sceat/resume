<template>
  <section v-reveal class="contact" aria-labelledby="contact-heading">
    <div class="contact__inner">
      <Separator type="frame" />

      <h2 id="contact-heading" class="sr-only">Contact</h2>

      <span class="pill-status contact__pill" data-status="success">
        <span class="pill-status__dot" aria-hidden="true" />
        {{ profile.status.availability }} · {{ profile.status.ecosystem }}
      </span>

      <pre class="contact__terminal" aria-label="Availability snapshot">
<span class="prompt">$</span> contact --availability
<span class="prompt">&gt;</span> open to: <span class="value">senior fullstack · {{ profile.status.ecosystem }}</span>
<span class="prompt">&gt;</span> mode: <span class="value">{{ profile.status.remote ? 'remote' : 'on-site' }} · async-first</span>
<span class="prompt">&gt;</span> timezone: <span class="value">utc+8 · overlaps EU mornings &amp; US evenings</span>
<span class="prompt">&gt;</span> response: <span class="value">&lt;24h</span>
</pre>

      <button
        type="button"
        class="btn-terminal btn-terminal-ghost contact__email"
        :aria-label="`Copy email ${profile.email}`"
        @click="copyEmail"
      >
        <span class="contact__email-text">{{ profile.email }}</span>
        <span
          :class="['contact__email-toast', { 'is-visible': copied }]"
          aria-hidden="true"
        >
          copied ✓
        </span>
      </button>

      <p class="contact__hint">
        click to copy · or
        <a :href="`mailto:${profile.email}`" class="btn-terminal-link contact__hint-link">
          open in mail
        </a>
      </p>

      <ul class="contact__icons" aria-label="External profiles">
        <li>
          <a
            :href="`https://github.com/${profile.github.replace(/^@/, '')}`"
            target="_blank"
            rel="noreferrer noopener"
            class="contact__icon-link"
            aria-label="GitHub profile"
          >
            <Icon name="github" :size="16" />
            <span>{{ profile.github }}</span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { profile } from '../content/profile.js'
import { useClipboard } from '../composables/use-clipboard.js'
import Icon from '../components/icon.vue'
import Separator from '../components/separator.vue'

const { copy, copied } = useClipboard()

const copyEmail = () => copy(profile.email)
</script>

<style scoped>
.contact {
  width: 100%;
  padding: 5rem 1rem;
  background: color-mix(in oklab, var(--color-surface) 60%, var(--color-bg));
  border-top: 1px solid var(--color-line);
}

.contact__inner {
  margin: 0 auto;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
}

.contact__pill {
  margin-top: 0.5rem;
}

.contact__terminal {
  width: 100%;
  margin: 0;
  padding: 1.25rem 1.25rem;
  font-family: var(--font-mono);
  font-size: var(--text-mono-sm);
  line-height: 1.7;
  text-align: left;
  color: var(--color-fg);
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: 6px;
  white-space: pre-wrap;
  overflow-x: auto;
}

.contact__terminal .prompt {
  color: var(--color-primary);
  margin-right: 0.5rem;
}

.contact__terminal .value {
  color: var(--color-fg);
}

/* Email button: ghost variant with email-specific overrides */
.contact__email {
  font-size: 1rem;
  text-transform: none;
  letter-spacing: var(--track-mono-tight);
  color: var(--color-primary);
  border-style: dashed;
  border-color: color-mix(in oklab, var(--color-primary) 40%, var(--color-line));
}

.contact__email:hover {
  color: var(--color-primary-glow);
}

.contact__email-text {
  letter-spacing: 0.01em;
}

.contact__email-toast {
  font-size: var(--text-mono-xs);
  color: var(--color-success);
  opacity: 0;
  transform: translateY(2px);
  transition:
    opacity var(--dur-normal) var(--ease-out-expo),
    transform var(--dur-normal) var(--ease-out-expo);
}

.contact__email-toast.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.contact__hint {
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: var(--text-mono-xs);
  color: var(--color-fg-mute);
  margin-top: -0.25rem;
}

.contact__hint-link {
  /* btn-terminal-link handles the rest */
  font-size: var(--text-mono-xs);
}

.contact__icons {
  display: flex;
  gap: 1.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Icon link: similar feel to btn-terminal-link but supports icon + text */
.contact__icon-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  font-family: var(--font-mono);
  font-size: var(--text-mono-sm);
  color: var(--color-fg-dim);
  text-decoration: none;
  border: 1px solid var(--color-line);
  border-radius: 6px;
  transition:
    color var(--dur-fast) var(--ease-standard),
    border-color var(--dur-fast) var(--ease-standard),
    background-color var(--dur-fast) var(--ease-standard),
    transform var(--dur-fast) var(--ease-out-expo);
}

.contact__icon-link:hover {
  color: var(--color-primary);
  border-color: color-mix(in oklab, var(--color-primary) 50%, var(--color-line));
  background: color-mix(in oklab, var(--color-primary) 6%, transparent);
}

.contact__icon-link:active {
  transform: scale(0.98);
}

.contact__icon-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (min-width: 768px) {
  .contact {
    padding: 6rem 1.5rem;
  }
  .contact__email {
    font-size: 1.25rem;
    padding: 0.75rem 1.25rem;
  }
  .contact__terminal {
    font-size: 0.875rem;
    padding: 1.5rem 1.75rem;
  }
}
</style>
