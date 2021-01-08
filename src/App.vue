<template lang="pug">
main
  Snav
  Shero
</template>

<script>
import Snav from './components/nav.vue'
import Shero from './components/hero.vue'

export default {
  name: 'App',
  components: {
    Snav,
    Shero,
  }
}
</script>

<style lang="stylus">
@font-face
  font-family 'sweet-retro'
  src url('~./assets/sweet-retro.ttf')

sc-reset()
    margin 0
    padding 0
    box-sizing border-box

sc-disableScollBar()
    ::-webkit-scrollbar
        display: none;

:root
  font-size 18px
  background #eee

*
  sc-reset()
  font-family 'Raleway', sans-serif
  outline none
  scroll-behavior smooth
  &::-webkit-scrollbar-track
    box-shadow inset 0 0 6px rgba(0, 0, 0, .3)
    background-color #555
  &::-webkit-scrollbar
    width 12px
    background-color #F5F5F5
  &::-webkit-scrollbar-thumb
    box-shadow inset 0 0 6px rgba(0, 0, 0, .3)
    background-color #252525
  a
    :active
      color #e1c79b
      fill #e1c79b
</style>