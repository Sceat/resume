<template>
  <section
    v-reveal
    class="more-projects"
    aria-labelledby="more-projects-heading"
  >
    <div class="more-projects__inner">
      <h2 id="more-projects-heading" class="sr-only">More projects</h2>

      <!-- ─────────────────────────────────────────────────────────────── -->
      <!-- Sub-section A — past employment timeline                        -->
      <!-- ─────────────────────────────────────────────────────────────── -->
      <Separator type="comment" label="// past employment —" />

      <EmploymentTimeline :work="work" class="more-projects__timeline" />

      <!-- ─────────────────────────────────────────────────────────────── -->
      <!-- Sub-section B — personal long-tail grid                         -->
      <!-- ─────────────────────────────────────────────────────────────── -->
      <Separator
        type="comment"
        label="// the long tail · personal —"
        class="more-projects__sep"
      />

      <div
        class="more-projects__filters"
        role="tablist"
        aria-label="Filter personal projects"
      >
        <button
          v-for="opt in filters"
          :key="opt.value"
          type="button"
          role="tab"
          :aria-selected="filter === opt.value"
          :class="['filter-chip', { 'is-active': filter === opt.value }]"
          @click="filter = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>

      <div class="more-projects__grid">
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.name"
          :project="project"
          variant="personal"
        />
      </div>

      <p
        v-if="filteredProjects.length === 0"
        class="more-projects__empty"
        role="status"
      >
        &gt; no projects match this filter
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

import EmploymentTimeline from '../components/employment-timeline.vue'
import ProjectCard from '../components/project-card.vue'
import Separator from '../components/separator.vue'
import { projects } from '../content/projects.js'
import { work } from '../content/work.js'

const filters = [
  { label: 'all', value: 'all' },
  { label: 'active', value: 'active' },
  { label: 'archived', value: 'archived' },
  { label: 'open-source', value: 'oss' },
]

const filter = ref('all')

/**
 * Match each project against the selected filter.
 * - 'all'        → everything
 * - 'active'     → live, maintained, testnet, or active in status text
 * - 'archived'   → past, archived, abandoned
 * - 'oss'        → has a github link or proof.github
 */
function matches(project, f) {
  if (f === 'all') return true
  const status = project.status.toLowerCase()
  if (f === 'active') {
    return (
      status.includes('live') ||
      status.includes('maintained') ||
      status.includes('testnet') ||
      status.includes('active') ||
      status.includes('production') ||
      status.includes('prototyping')
    )
  }
  if (f === 'archived') {
    return (
      status.includes('past') ||
      status.includes('archived') ||
      status.includes('abandoned')
    )
  }
  if (f === 'oss') {
    return Boolean(
      project.proof?.github ||
        (project.link && project.link.includes('github.com')),
    )
  }
  return true
}

const filteredProjects = computed(() =>
  projects.filter((p) => matches(p, filter.value)),
)
</script>

<style scoped>
.more-projects {
  width: 100%;
  padding: 4rem 1rem;
}

.more-projects__inner {
  margin: 0 auto;
  max-width: 1100px;
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

.more-projects__timeline {
  margin-bottom: 1rem;
}

.more-projects__sep {
  margin-top: 4rem;
}

/* ── Filter chips ─────────────────────────────────────────────────────── */
.more-projects__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin: 0 0 1.25rem 0;
}

.filter-chip {
  font-family: var(--font-mono);
  font-size: var(--text-mono-2xs);
  letter-spacing: var(--track-mono-wide);
  text-transform: uppercase;
  color: var(--color-fg-mute);
  background: transparent;
  border: 1px solid var(--hairline);
  border-radius: 0;
  padding: 0.375rem 0.75rem;
  cursor: pointer;
  transition:
    color var(--dur-fast) var(--ease-standard),
    border-color var(--dur-fast) var(--ease-standard),
    background-color var(--dur-fast) var(--ease-standard),
    box-shadow var(--dur-fast) var(--ease-standard);
}

.filter-chip:hover {
  color: var(--color-fg-dim);
  border-color: color-mix(in oklab, var(--color-primary) 30%, var(--hairline));
}

.filter-chip.is-active {
  color: var(--color-primary-glow);
  border-color: color-mix(in oklab, var(--color-primary) 50%, transparent);
  background: color-mix(in oklab, var(--color-primary) 8%, transparent);
  box-shadow: 0 0 18px -6px color-mix(in oklab, var(--color-primary) 50%, transparent);
}

.filter-chip:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 1px var(--color-bg),
    0 0 0 3px color-mix(in oklab, var(--color-primary) 70%, transparent);
}

/* ── Grid ─────────────────────────────────────────────────────────────── */
.more-projects__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;
}

@media (min-width: 640px) {
  .more-projects__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .more-projects {
    padding: 5rem 1.5rem;
  }
  .more-projects__grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
}

.more-projects__empty {
  margin-top: 1rem;
  padding: 1.5rem;
  font-family: var(--font-mono);
  font-size: var(--text-mono-sm);
  color: var(--color-fg-mute);
  border: 1px dashed var(--hairline);
  text-align: center;
}
</style>
