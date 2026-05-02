<!--
  Separator — section break primitive.

  Four variants, each tied to a CSS class in src/styles/system.css.
  Sections consume <Separator> instead of <hr> or border-top hacks.

  Usage:
    <Separator type="comment" label="// flagships —" />
    <Separator type="scan" />
    <Separator type="dots" :count="40" />
    <Separator type="frame" />

  All variants:
    - role="separator" semantically
    - aria-hidden="true" because they're decorative; sections expose their own h2
    - respect prefers-reduced-motion (animation disabled in system.css)
-->
<template>
  <div
    :class="['sep', `sep--${type}`]"
    role="separator"
    aria-hidden="true"
  >
    <!-- comment: `// label —` + thin gradient line -->
    <template v-if="type === 'comment'">
      <span class="sep__label">{{ label }}</span>
      <span class="sep__line" />
    </template>

    <!-- scan: animated horizontal scan line -->
    <template v-else-if="type === 'scan'" />

    <!-- dots: row of small staggered mono dots -->
    <template v-else-if="type === 'dots'">
      <span
        v-for="i in count"
        :key="i"
        class="sep__dot"
        :style="{ animationDelay: `${(i - 1) * 12}ms` }"
      />
    </template>

    <!-- frame: corner brackets with hairline center line -->
    <template v-else-if="type === 'frame'">
      <span class="sep__corner sep__corner--tl" />
      <span class="sep__corner sep__corner--tr" />
      <span class="sep__corner sep__corner--bl" />
      <span class="sep__corner sep__corner--br" />
      <span class="sep__line-h" />
    </template>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'comment',
    validator: (v) => ['comment', 'scan', 'dots', 'frame'].includes(v),
  },
  label: { type: String, default: '// section —' },
  count: { type: Number, default: 40 },
})
</script>
