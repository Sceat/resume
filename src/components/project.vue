<script setup>
const props = defineProps([
  'name',
  'description',
  'asset',
  'color',
  'iframe',
  'link',
])
</script>

<template lang="pug">
section.project(:style="{ borderLeft: '2px dashed #' + props.color }")
  .text
    component(:is="props.link ? 'a':'h2'" :href="props.link" target="_blank") {{ props.name }}
    span {{ props.description }}
  .demo
    img(v-if="props.asset" :src="props.asset")
    iframe(v-else :src="props.iframe" width="1080" height="720" frameborder="0" allow="autoplay; fullscreen; picture-in-picture")
</template>

<style lang="stylus" scoped>
section.project
  margin 3em
  padding-left 2em
  .text
    display flex
    flex-flow column nowrap
    a,h2
      text-transform uppercase
      font-weight 400
      font-size 2em
      margin-bottom .5em
      color black
  span
    opacity .8
    font-weight 300
  .demo
    display flex
    justify-content center
    align-items center
    margin-top 2em
    img
      filter drop-shadow(1px 2px 3px black)
      border-radius 10px
      overflow hidden
      max-width: 1200px
</style>
