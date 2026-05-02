<template>
  <section v-reveal class="skills" aria-labelledby="skills-heading">
    <div class="skills__inner">
      <Separator type="comment" label="// stack —" />

      <h2 id="skills-heading" class="sr-only">Skills matrix</h2>

      <div class="skills__polyglot">
        <p class="skills__polyglot-line">
          <span class="skills__label">primary:</span>
          <span class="skills__primary-value">{{ skills.primary }}</span>
        </p>
        <p class="skills__polyglot-line">
          <span class="skills__label">also fluent:</span>
          <span class="skills__fluent-value">
            {{ skills.alsoFluent.join(' · ') }}
          </span>
        </p>
      </div>

      <div class="skills__grid">
        <div
          v-for="(group, idx) in skills.groups"
          :key="group.name"
          class="skills__group"
          :style="{ '--reveal-delay': `${idx * 80}ms` }"
        >
          <h3 class="skills__group-name">// {{ group.name }}</h3>
          <ul class="skills__items">
            <li v-for="item in group.items" :key="item.name">
              <SkillPill :name="item.name" :primary="item.primary" />
            </li>
          </ul>
        </div>
      </div>

      <p class="skills__method">
        <span class="skills__method-prompt" aria-hidden="true">&gt;</span>
        {{ skills.method }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { skills } from '../content/skills.js'
import SkillPill from '../components/skill-pill.vue'
import Separator from '../components/separator.vue'
</script>

<style scoped>
.skills {
  width: 100%;
  padding: 4rem 1rem;
  background: color-mix(in oklab, var(--color-surface) 35%, var(--color-bg));
  border-block: 1px solid var(--color-line);
}

.skills__inner {
  margin: 0 auto;
  max-width: 1100px;
}

.skills__polyglot {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 1.5rem;
  margin-bottom: 1.75rem;
  border-bottom: 1px dashed var(--color-line);
  font-family: var(--font-mono);
  font-size: var(--text-mono-sm);
}

.skills__polyglot-line {
  margin: 0;
}

.skills__label {
  color: var(--color-fg-mute);
  margin-right: 0.5rem;
  letter-spacing: var(--track-mono-wide);
}

.skills__primary-value {
  color: var(--color-primary);
  font-weight: 500;
}

.skills__fluent-value {
  color: var(--color-fg-dim);
}

.skills__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.skills__group {
  opacity: 0;
  transform: translateY(8px);
  animation: skills-stagger-in 540ms var(--ease-out-expo) forwards;
  animation-delay: var(--reveal-delay, 0ms);
}

@keyframes skills-stagger-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.skills__group-name {
  font-family: var(--font-mono);
  font-size: var(--text-mono-2xs);
  font-weight: 400;
  letter-spacing: var(--track-mono-widest);
  text-transform: uppercase;
  color: var(--color-fg-mute);
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-line);
}

.skills__items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.skills__method {
  margin: 1.75rem 0 0;
  padding-top: 1.25rem;
  border-top: 1px dashed var(--color-line);
  font-family: var(--font-mono);
  font-size: var(--text-mono-sm);
  color: var(--color-fg-dim);
  letter-spacing: var(--track-mono-tight);
  line-height: 1.6;
}

.skills__method-prompt {
  color: var(--color-primary);
  margin-right: 0.5rem;
  opacity: 0.85;
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

@media (min-width: 640px) {
  .skills__polyglot {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }
}

@media (min-width: 768px) {
  .skills__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

@media (min-width: 1024px) {
  .skills {
    padding: 5rem 1.5rem;
  }
  .skills__grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
  .skills__items {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skills__group {
    opacity: 1;
    transform: none;
    animation: none;
  }
}
</style>
