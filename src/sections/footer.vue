<template>
  <footer class="site-footer">
    <Separator type="frame" class="site-footer__sep" />

    <div class="site-footer__inner">
      <div class="site-footer__row site-footer__row--top">
        <MascotFlag :size="56" class="site-footer__mascot" />
        <span class="site-footer__copy">© {{ year }} cyril morlet</span>
        <span class="site-footer__divider" aria-hidden="true" />
        <span class="site-footer__meta">
          built with
          <span class="site-footer__hl">vue 3</span>
          <span class="site-footer__sep-dot" aria-hidden="true" />
          <span class="site-footer__hl">tailwind v4</span>
          <span class="site-footer__sep-dot" aria-hidden="true" />
          <span class="site-footer__hl">pdfmake</span>
        </span>
      </div>

      <div class="site-footer__row site-footer__row--bottom">
        <a
          class="btn-terminal-link site-footer__link"
          href="https://github.com/sceat/resume"
          rel="noopener"
          target="_blank"
        >
          source: github.com/sceat/resume
        </a>
        <span class="site-footer__deploy">
          <span class="site-footer__deploy-key">last deploy</span>
          <span class="site-footer__deploy-val">{{ deployDate }}</span>
          <span class="site-footer__sep-dot" aria-hidden="true" />
          <span class="site-footer__deploy-key">commit</span>
          <span class="site-footer__deploy-val site-footer__hash">{{ commitHash }}</span>
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

import MascotFlag from '../components/mascot-flag.vue'
import Separator from '../components/separator.vue'

const buildInfoRaw = import.meta.env.VITE_BUILD_INFO || ''
const buildInfo = (() => {
  if (!buildInfoRaw) return { date: '', commit: '' }
  try {
    return JSON.parse(buildInfoRaw)
  } catch {
    return { date: '', commit: '' }
  }
})()

const deployDate = computed(() => buildInfo.date || 'dev')
const commitHash = computed(() => buildInfo.commit || 'local')
const year = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  margin-top: 4rem;
  padding-bottom: 2.5rem;
}

@media (min-width: 768px) {
  .site-footer {
    margin-top: 6rem;
  }
}

.site-footer__sep {
  max-width: 80rem;
  margin-inline: auto;
  padding-inline: 1rem;
}

.site-footer__inner {
  margin: 0 auto;
  max-width: 80rem;
  padding: 1rem 1rem 0;
  font-family: var(--font-mono);
  font-size: var(--text-mono-xs);
  letter-spacing: var(--track-mono-tight);
  color: var(--color-fg-mute);
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

@media (min-width: 640px) {
  .site-footer__inner {
    padding-inline: 1.5rem;
  }
}

.site-footer__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.625rem;
  line-height: 1.6;
}

.site-footer__row--bottom {
  justify-content: space-between;
  border-top: 1px dashed var(--hairline);
  padding-top: 0.875rem;
}

.site-footer__mascot {
  margin-right: 0.25rem;
  margin-bottom: -2px;
}

.site-footer__copy {
  color: var(--color-fg-dim);
}

.site-footer__divider {
  display: inline-block;
  width: 1px;
  height: 12px;
  background: var(--hairline);
}

.site-footer__meta {
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
}

.site-footer__hl {
  color: var(--color-fg-dim);
}

.site-footer__sep-dot {
  display: inline-block;
  width: 2px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.5;
}

.site-footer__deploy {
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
  flex-wrap: wrap;
}

.site-footer__deploy-key {
  color: var(--color-fg-mute);
  text-transform: uppercase;
  letter-spacing: var(--track-mono-wide);
  font-size: var(--text-mono-2xs);
}

.site-footer__deploy-val {
  color: var(--color-fg-dim);
}

.site-footer__hash {
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: var(--color-primary);
}
</style>
