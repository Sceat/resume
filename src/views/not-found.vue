<template>
  <main class="not-found">
    <p>
      <span class="prompt">$</span> cd <span class="path">{{ path }}</span>
    </p>
    <p>
      <span class="err">cd: no such file or directory: 404</span>
    </p>
    <p>
      <router-link to="/">$ cd ~</router-link>
    </p>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const path = computed(() => route.fullPath)
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  font-family: var(--font-mono);
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-fg);
  background: var(--color-bg);
}
.not-found p {
  margin: 0;
}
.prompt {
  color: var(--color-primary);
}
.path {
  color: var(--color-fg-dim);
}
.err {
  color: var(--color-danger);
}
.not-found a {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px dashed
    color-mix(in oklab, var(--color-primary) 40%, transparent);
}
.not-found a:hover {
  color: var(--color-primary-glow);
  border-bottom-color: var(--color-primary-glow);
}
</style>
