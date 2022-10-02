<template lang="pug">
main(v-if="breakpoints.desktop.matches")
  Snav
  Shero
  Smyself
  Smywork
  Sfooter
main.sm(v-else)
  section.soon
    h1 The mobile app will #[b soon] be available&nbsp;!
    span Use the desktop version instead
</template>

<script>
import Snav from '../components/nav.vue'
import Shero from '../components/hero.vue'
import Smyself from '../components/myself.vue'
import Smywork from '../components/mywork.vue'
import Sfooter from '../components/footer.vue'

import useBreakpoints from 'vue-next-breakpoints'
export default {
  name: 'Home',
  components: {
    Snav,
    Shero,
    Smyself,
    Smywork,
    Sfooter,
  },
  setup() {
    const breakpoints = useBreakpoints({
      mobile: 1050, // max-width: 600px
      desktop: [1051], // min-width: 601px
    })

    return {
      breakpoints,
    }
  },
}
</script>

<style lang="stylus">

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
</style>
