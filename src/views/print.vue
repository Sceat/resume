<template>
  <main class="print-root">
    <!--
      /print — visual QA preview of the PDF layout.
      NOT the canonical PDF source: pdfmake script in scripts/render-pdf.mjs is.
      This route exists so the user can scan content correctness in the browser
      without rebuilding the PDF on every edit. Light theme inline (overrides
      the dark site theme); structure/order mirrors render-pdf.mjs section-by-section.
    -->

    <header class="head">
      <div class="head-left">
        <h1 class="name">{{ profile.name.toUpperCase() }}</h1>
        <p class="subtitle">
          {{ profile.title }} · Sui Move · Web3
        </p>
        <p class="contact">
          <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>
          <span class="sep"> · </span>
          <a :href="`https://${profile.site}`">{{ profile.site }}</a>
          <span class="sep"> · </span>
          <a :href="`https://github.com/${profile.github.replace(/^@/, '')}`">
            github.com/{{ profile.github.replace(/^@/, '') }}
          </a>
        </p>
        <p class="meta">
          {{ profile.location.city }}, {{ profile.location.country }}
          <span class="sep"> · </span>
          {{
            profile.languages
              .map((l) => `${l.name} (${l.level})`)
              .join(', ')
          }}
        </p>
      </div>
      <div class="head-right">
        <div class="qr-ph" aria-hidden="true">QR</div>
        <p class="qr-cap">sceat.xyz</p>
      </div>
    </header>

    <section>
      <h2>Profile</h2>
      <hr />
      <p>
        12 years senior fullstack engineer. Ex-Bitfinex blockchain integration
        specialist (2022—2024). Solo-operating a live MMORPG with 1300+ users
        while building on-chain games on Sui. Available for remote roles in the
        Sui ecosystem.
      </p>
    </section>

    <section>
      <h2>Experience</h2>
      <hr />
      <div v-for="w in work" :key="w.company" class="entry">
        <div class="entry-head">
          <p class="entry-title">
            <strong>{{ w.role }}</strong>
            <span class="sep"> · </span>
            <span class="accent">{{ w.company }}</span>
          </p>
          <p class="entry-meta">
            {{ formatPeriod(w.period) }}<br />
            <span class="dim">
              {{ w.location }}{{ w.remote ? ' · remote' : ' · in-office' }}
            </span>
          </p>
        </div>
        <ul>
          <li v-for="b in w.bullets.slice(0, 2)" :key="b">{{ b }}</li>
        </ul>
      </div>
    </section>

    <section>
      <h2>Highlighted Projects</h2>
      <hr />
      <div v-for="f in flagships" :key="f.id" class="flag">
        <p class="flag-title"><strong>{{ f.title }}</strong></p>
        <p class="mono dim">{{ f.scale.join('  ·  ') }}</p>
        <p class="mono dim">{{ f.stack.join('  ·  ') }}</p>
        <p v-if="f.proof.length" class="mono">
          <template v-for="(p, i) in f.proof" :key="p.label">
            <span v-if="i > 0" class="sep"> · </span>
            <a v-if="p.href" :href="p.href">{{ p.label }}</a>
            <span v-else>{{ p.label }}</span>
          </template>
        </p>
      </div>
    </section>

    <div class="page-break"></div>

    <section>
      <h2>Skills</h2>
      <hr />
      <p class="skills-headline">
        <strong>Primary:</strong> {{ skills.primary }}
        <span class="dim">  ·  Also fluent: </span>
        {{ skills.alsoFluent.join(', ') }}
      </p>
      <div class="skill-grid">
        <div v-for="g in skills.groups" :key="g.name" class="skill-col">
          <h3>{{ g.name.toUpperCase() }}</h3>
          <ul class="plain">
            <li
              v-for="it in g.items"
              :key="it.name"
              :class="{ primary: it.primary }"
            >
              {{ it.name }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h2>More Projects</h2>
      <hr />
      <p v-for="p in projects" :key="p.name" class="proj">
        <strong>{{ p.name }}</strong>
        <span class="dim">  —  {{ p.tagline }}  ·  </span>
        <em class="mute">{{ p.status }}</em>
      </p>
    </section>

    <section>
      <h2>Open Source</h2>
      <hr />
      <p v-for="l in libs" :key="l.name" class="proj">
        <strong>{{ l.name }}</strong>
        <span class="dim">  —  {{ l.tagline }}  ·  </span>
        <a :href="l.url">{{ l.url.replace(/^https?:\/\//, '') }}</a>
      </p>
    </section>

    <section>
      <h2>Education</h2>
      <hr />
      <p>Self-taught · 2014 — present</p>
    </section>

    <footer class="foot">
      <span class="dim">see live: </span>
      <a href="https://sceat.xyz">sceat.xyz</a>
      <span class="dim">  ·  last updated {{ today }}</span>
    </footer>
  </main>
</template>

<script setup>
import { computed } from 'vue'

import { profile } from '../content/profile.js'
import { work } from '../content/work.js'
import { flagships } from '../content/flagships.js'
import { projects } from '../content/projects.js'
import { libs } from '../content/libs.js'
import { skills } from '../content/skills.js'

const today = computed(() => new Date().toISOString().slice(0, 10))

function formatPeriod(period) {
  const to = period.to || 'present'
  return `${period.from} — ${to}`
}
</script>

<style scoped>
/* Light-theme print preview — overrides the global dark theme. Visual fidelity
   to the PDF is "close enough for QA", not pixel-perfect. */
.print-root {
  background: #ffffff;
  color: #0b1220;
  font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.45;
  max-width: 820px;
  margin: 0 auto;
  padding: 40px;
  min-height: 100vh;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 8px;
}
.head-left {
  flex: 1;
}
.name {
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0 0 4px 0;
}
.subtitle {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 13px;
  color: #475569;
  margin: 0 0 8px 0;
}
.contact, .meta {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 12px;
  margin: 0 0 4px 0;
}
.contact a {
  color: #2563eb;
  text-decoration: underline;
}
.head-right {
  text-align: right;
}
.qr-ph {
  width: 70px;
  height: 70px;
  border: 1px dashed #cbd5e1;
  display: grid;
  place-items: center;
  font-size: 10px;
  color: #94a3b8;
  font-family: 'JetBrains Mono', monospace;
}
.qr-cap {
  font-size: 9px;
  color: #94a3b8;
  font-family: 'JetBrains Mono', monospace;
  margin: 4px 0 0 0;
}

section {
  margin-top: 18px;
}
h2 {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #1d4ed8;
  margin: 0 0 4px 0;
}
hr {
  border: none;
  border-top: 1px solid #cbd5e1;
  margin: 0 0 8px 0;
}
h3 {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #1d4ed8;
  margin: 0 0 2px 0;
}

.entry {
  margin-bottom: 8px;
}
.entry-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.entry-title {
  margin: 0;
}
.entry-title .accent {
  color: #1d4ed8;
}
.entry-meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #475569;
  text-align: right;
  margin: 0;
}
.entry ul {
  margin: 4px 0 0 16px;
  padding: 0;
}
.entry li {
  color: #475569;
}

.flag {
  margin-bottom: 10px;
}
.flag-title {
  margin: 0;
}

.skills-headline {
  margin: 0 0 8px 0;
}
.skill-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.skill-col ul.plain {
  list-style: none;
  padding: 0;
  margin: 0;
}
.skill-col li {
  color: #475569;
  font-size: 13px;
}
.skill-col li.primary {
  color: #0b1220;
  font-weight: 700;
}

.proj {
  margin: 0 0 2px 0;
}

.mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
}
.dim {
  color: #475569;
}
.mute {
  color: #64748b;
}
.sep {
  color: #94a3b8;
}

.page-break {
  height: 0;
  margin: 24px 0;
  border-top: 1px dashed #cbd5e1;
  position: relative;
}
.page-break::before {
  content: 'page break';
  position: absolute;
  top: -8px;
  right: 0;
  background: #fff;
  padding: 0 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: #94a3b8;
}

a {
  color: #2563eb;
}

.foot {
  margin-top: 32px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #475569;
}
</style>
