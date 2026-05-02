<template>
  <span :class="['skill-pill', { 'skill-pill--primary': primary }]">
    {{ name }}
  </span>
</template>

<script setup>
/**
 * Mono uppercase chip used in the skills matrix and flagship scale rows.
 * Pass `primary` for the headline skill in a group (border-primary + glow on hover).
 */
defineProps({
  name: { type: String, required: true },
  primary: { type: Boolean, default: false },
})
</script>

<style scoped>
.skill-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  font-family: var(--font-mono);
  font-size: var(--text-mono-2xs);
  letter-spacing: var(--track-mono-wide);
  text-transform: uppercase;
  color: var(--color-fg-dim);
  background: color-mix(in oklab, var(--color-surface-2) 60%, transparent);
  border: 1px solid var(--color-line);
  border-radius: 9999px;
  white-space: nowrap;
  transition:
    color var(--dur-fast) var(--ease-out-expo),
    border-color var(--dur-fast) var(--ease-out-expo),
    box-shadow var(--dur-fast) var(--ease-out-expo),
    background-color var(--dur-fast) var(--ease-out-expo),
    transform var(--dur-fast) var(--ease-out-expo);
}

.skill-pill:hover {
  color: var(--color-fg);
  border-color: color-mix(in oklab, var(--color-primary) 50%, var(--color-line));
  box-shadow: 0 0 16px -6px color-mix(in oklab, var(--color-primary) 40%, transparent);
}

.skill-pill:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
}

.skill-pill--primary {
  color: var(--color-primary);
  border-color: color-mix(in oklab, var(--color-primary) 60%, var(--color-line));
  background: color-mix(in oklab, var(--color-primary) 8%, var(--color-surface-2));
}

.skill-pill--primary:hover {
  color: var(--color-primary-glow);
  border-color: var(--color-primary-glow);
  box-shadow: 0 0 22px -6px color-mix(in oklab, var(--color-primary-glow) 55%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .skill-pill {
    transition-duration: var(--dur-instant);
  }
}
</style>
