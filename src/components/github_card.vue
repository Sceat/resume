<template lang="pug">
.project(@click="open_link()" :class="{ starred: project.starred }")
  fa(icon="github" type="fab")
  h1 {{ project.title }}
  span.desc {{ project.desc }}
  span.lang {{ project.lang }}
  span.dot(:style="{ background: project.color }")
  fa.crown(icon="crown" v-if="project.starred")
</template>

<script>
export default {
  props: {
    project: Object
  },
  setup({ project }) {
    return {
      open_link: () => window.open(project.link, '_blank')
    }
  }
}
</script>

<style lang="stylus" scoped>
.project
  display grid
  grid "logo logo h1" auto "logo logo desc" auto "dot lang lang" auto / 30px 25px 1fr
  align-items center
  background #212121
  padding 1em
  padding-bottom 0
  font-size .9rem
  border-radius 5px
  color white
  cursor pointer
  box-shadow 0 1px 3px rgba(0, 0, 0, .12), 0 1px 2px rgba(0, 0, 0, .24)
  transition all .3s cubic-bezier(.25, .8, .25, 1)
  position relative
  &.starred
    border 2px solid #FFA000

  &:hover
      box-shadow 0 14px 28px rgba(0, 0, 0, .25), 0 10px 10px rgba(0, 0, 0, .22)
  svg
    width 50px
    grid-area logo
    opacity .8
    &.crown
      grid-area none
      width 20px
      opacity 1
      position absolute
      color #FFA000
      top .5em
      right .5em
  span.dot
    gird-area dot
    width 15px
    height @width
    border-radius 50px
    place-self center center
  span.desc
    grid-area desc
    padding .5em 10px
  span.lang
    grid-area lang
    border-top 1px dashed rgba(#eee, .4)
    padding 1em 0
    font-family 'nimbus-sans', sans-serif
    text-transform uppercase
    font-size .75em
  h1
    grid-area h1
    padding 0 10px
    font-weight 900
</style>