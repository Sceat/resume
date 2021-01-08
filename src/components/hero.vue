<template lang="pug">
section.hero
  .left
    Sorb.orb
    .bar
    span Download My Cv
    .icons
      a(href="https://github.com/sceat" target="_blank")
        fa.fa(icon="github-alt" type="fab" size="lg")
      a(href="https://stackoverflow.com/users/10632388/sceat" target="_blank")
        fa.fa(icon="stack-overflow" type="fab" size="lg")
  .right
</template>

<script>
import Sorb from './orb.vue'

export default {
  components: {
    Sorb
  }
}
</script>

<style lang="stylus" scoped>
.orb
  position absolute
  bottom 150px
  left 50px
  z-index 1
section.hero
  width 100vw
  overflow hidden
  padding 2em 200px
  .left
    display flex
    flex-flow column nowrap
    justify-content center
    align-items center
    width 50px
    position relative
    z-index 2
    a
      cursor pointer
      color black
    span
      transform rotateZ(-90deg)
      margin 150px 0
      white-space nowrap
      cursor pointer
    .bar
      height 140px
      width 1px
      background #212121
      margin-bottom 2em
    .icons
      display flex
      flex-flow column nowrap
      .fa
        width 20px
        padding-bottom 1em
</style>