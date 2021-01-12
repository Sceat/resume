<template lang="pug">
main(v-if="breakpoints.desktop.matches")
  Snav
  Shero
  Smyself
  Smywork
main.sm(v-else)
  section.soon
    h1 The mobile app will #[b soon] be available&nbsp;!
    span Use the desktop version instead
</template>

<script>
import Snav from './components/nav.vue'
import Shero from './components/hero.vue'
import Smyself from './components/myself.vue'
import Smywork from './components/mywork.vue'

import smooth from 'smooth-parallax'
import { onMounted } from 'vue'
import useBreakpoints from "vue-next-breakpoints";

export default {
  name: 'App',
  components: {
    Snav,
    Shero,
    Smyself,
    Smywork
  },
  setup() {
    const breakpoints = useBreakpoints({
      mobile: 1050, // max-width: 600px
      desktop: [1051], // min-width: 601px
    });

    onMounted(() => {
      smooth.init()
    })

    return {
      breakpoints,
    }
  }
}
</script>

<style lang="stylus">
@font-face
  font-family "nimbus-sans"
  src url("assets/nimbus-sans.bold.otf") format("otf");

main.sm
  section.soon
    width 100vw
    height 100vh
    min-height 500px
    overflow hidden
    background #212121
    display flex
    justify-content center
    align-items center
    font-size 2em
    color #eee
    padding 0 1em
    position relative
    flex-flow column nowrap
    h1
      width 300px
      transform translateY(-100px)
      &::after
        content ''
        position absolute
        bottom -.2em
        left 0
        background crimson
        width 80px
        height 8px
      b
        color crimson
    span
      color #eee
      opacity .7
      font-weight 300
      font-size .6em
      align-self flex-start

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