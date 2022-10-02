<template lang="pug">
svg(
    xmlns="http://www.w3.org/2000/svg"
    :class="$props.class"
    :viewBox="`0 0 ${width} ${height}`"
  )
  path(fill="currentColor" :d="svgPath")
</template>

<script setup>
import { computed } from 'vue'
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core'

const props = defineProps(['icon', 'type'])

const definition = computed(() =>
  findIconDefinition({
    prefix: props.type,
    iconName: props.icon,
  })
)

const width = computed(() => definition.value.icon[0])
const height = computed(() => definition.value.icon[1])
const svgPath = computed(() => definition.value.icon[4])
</script>
