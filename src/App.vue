<template lang="pug">
main
  Snav
  Shero
  Smyself
  Smywork
</template>

<script>
import Snav from './components/nav.vue'
import Shero from './components/hero.vue'
import Smyself from './components/myself.vue'
import Smywork from './components/mywork.vue'

export default {
  name: 'App',
  components: {
    Snav,
    Shero,
    Smyself,
    Smywork
  }
}
</script>

<style lang="stylus">
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
  sc-disableScollBar()
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

.midnightHeader.light {
  color white
}
</style>