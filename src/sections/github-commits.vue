<template>
  <section v-reveal class="ghc" aria-labelledby="ghc-heading">
    <div class="ghc__inner">
      <Separator type="scan" />

      <header class="ghc__head">
        <h2 id="ghc-heading" class="ghc__title">
          // shipping commits in {{ year }} →
        </h2>
      </header>

      <div class="ghc__frame">
        <img
          v-show="!failed"
          :src="src"
          :alt="`GitHub contribution graph for @${user}`"
          class="ghc__img"
          loading="lazy"
          decoding="async"
          @error="failed = true"
          @load="failed = false"
        />

        <a
          v-if="failed"
          :href="`https://github.com/${user}`"
          target="_blank"
          rel="noreferrer noopener"
          class="ghc__fallback"
        >
          <span class="ghc__fallback-eyebrow">// embed unavailable</span>
          <span class="ghc__fallback-cta">
            github.com/{{ user }}
            <span aria-hidden="true">→</span>
          </span>
          <span class="ghc__fallback-hint">
            Live activity, repos, and commit history.
          </span>
        </a>
      </div>

      <p class="ghc__caption">
        <a
          :href="`https://github.com/${user}`"
          target="_blank"
          rel="noreferrer noopener"
          class="btn-terminal-link"
        >
          github.com/{{ user }}
        </a>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import Separator from '../components/separator.vue'

/**
 * Embed @sceat's GitHub contribution graph via the public ghchart.rshah.org
 * service, themed to match the cyberpunk-blue palette (color-override =
 * blue-400 #60a5fa). If the embed fails to load, we degrade gracefully to a
 * link card so the build never breaks.
 */
const user = 'sceat'
const src = `https://ghchart.rshah.org/60a5fa/${user}`
const year = new Date().getFullYear()
const failed = ref(false)
</script>

<style scoped>
.ghc {
  width: 100%;
  padding: 4rem 1rem;
}

.ghc__inner {
  margin: 0 auto;
  max-width: 1100px;
}

.ghc__head {
  margin-bottom: 1.25rem;
}

.ghc__title {
  font-family: var(--font-mono);
  font-size: var(--text-mono-xs);
  font-weight: 400;
  color: var(--color-fg-mute);
  letter-spacing: var(--track-mono-wide);
  text-transform: uppercase;
}

.ghc__frame {
  position: relative;
  padding: 1.25rem;
  background: color-mix(in oklab, var(--color-surface) 70%, transparent);
  backdrop-filter: blur(12px) saturate(1.3);
  -webkit-backdrop-filter: blur(12px) saturate(1.3);
  border: 1px solid var(--color-line);
  border-radius: 10px;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  isolation: isolate;
}

.ghc__frame::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at top,
    color-mix(in oklab, var(--color-primary) 8%, transparent) 0%,
    transparent 60%
  );
  pointer-events: none;
  z-index: -1;
}

.ghc__img {
  position: relative;
  width: 100%;
  height: auto;
  max-width: 900px;
  filter: drop-shadow(0 0 14px color-mix(in oklab, var(--color-primary) 25%, transparent));
}

.ghc__fallback {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  text-align: center;
  padding: 1.5rem 1rem;
  font-family: var(--font-mono);
  text-decoration: none;
  color: var(--color-fg);
  border: 1px dashed var(--color-line);
  border-radius: 6px;
  transition: border-color var(--dur-normal) var(--ease-standard);
}

.ghc__fallback:hover {
  border-color: color-mix(in oklab, var(--color-primary) 50%, var(--color-line));
}

.ghc__fallback-eyebrow {
  font-size: var(--text-mono-2xs);
  letter-spacing: var(--track-mono-widest);
  color: var(--color-fg-mute);
  text-transform: uppercase;
}

.ghc__fallback-cta {
  font-size: var(--text-body);
  color: var(--color-primary);
}

.ghc__fallback-hint {
  font-size: var(--text-mono-xs);
  color: var(--color-fg-dim);
}

.ghc__caption {
  margin-top: 1rem;
}

@media (min-width: 1024px) {
  .ghc {
    padding: 5rem 1.5rem;
  }
  .ghc__frame {
    padding: 2rem;
  }
  .ghc__title {
    font-size: var(--text-mono-sm);
  }
}
</style>
