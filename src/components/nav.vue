<template lang="pug">
mixin nav
  span#enter.self(v-scroll-to-anchor="'about'" :class="selected('about')") About me
  span#enter.work(v-scroll-to-anchor="'libs'" :class="selected('libs')") Libraries
  span#enter.projects(v-scroll-to-anchor="'projects'" :class="selected('projects')") Projects

transition(name="appear")
  nav.side(v-if="state.hidden")
    span.home(@click="scroll_to_top()") Home
    +nav
nav.top
  img(src="../assets/ukraine.png")
  .title__box
    span#enter.title Sceat.xyz
  +nav
  a#enter.contact(href="mailto:fetch@sceat.xyz") Hire me
    img.cross(src="../assets/redcross.png")
    .cursive.currently_working Currently working at #[.cursive Bitfinex]
</template>

<script setup>
import { onMounted, onBeforeUnmount, reactive } from 'vue'
import anime from 'animejs'

import { emitter } from '../util/anchors.js'

const state = reactive({ hidden: false, selected: 0 })
const on_scroll = () => {
  const { scrollY } = window
  if (state.hidden && scrollY < 100) state.hidden = false
  else if (!state.hidden && scrollY > 100) state.hidden = true
}

const on_anchor = anchor => (state.selected = anchor)

onMounted(() => {
  window.addEventListener('scroll', on_scroll, { passive: true })
  anime({
    targets: ['.top #enter'],
    translateX: [-40, 0],
    opacity: [0, 1],
    delay: anime.stagger(100, { start: 400 }),
    easing: 'easeOutCirc',
    duration: 600,
  })
  emitter.on('anchor', on_anchor)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', on_scroll)
  emitter.off('anchor', on_anchor)
})
const selected = anchor => ({ selected: anchor === state.selected })
const scroll_to_top = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<style lang="stylus" scoped>

.cursive
  font-family 'Indie Flower', cursive

.top
  #enter
    opacity 0

nav.side
  user-select none
  position fixed
  top 50%
  left 1.5em
  transform translateY(-50%)
  display flex
  flex-flow column nowrap
  z-index 10
  mix-blend-mode difference
  filter hue-rotate(190deg)
  color yellow

  &.appear-enter-active, &.appear-leave-active
    transition transform .5s ease

  &.appear-enter-from, &.appear-leave-to
    transform translateY(-50%) translateX(-150%)

  span
    color inherit
    cursor pointer
    position relative
    font-weight 300
    font-size .75em
    text-transform uppercase
    margin-top .5em
    will-change opacity
    text-decoration none

  span.selected::before
    content ''
    position absolute
    top 50%
    transform translateY(-50%)
    left -2.5em
    width 20px
    height 3px
    border-radius 50px
    background yellow

nav.top
  width 100%
  overflow hidden
  display grid
  grid 'link void self work projects contact' 40px / max-content 1fr max-content max-content max-content
  padding 2em 200px
  z-index 5

  img
    position absolute
    z-index 1
    transform rotate(90deg) scale(1.2)
    top 0
    left 0
    // opacity .5

  .title__box
    filter drop-shadow(0 3px 3px rgba(0, 0, 0, .6))
    grid-area link
    cursor pointer
    z-index 2

  span,a
    padding-right 1em
    cursor pointer
    font-weight 300
    display flex
    justify-content center
    align-items center
    text-decoration none
    color #212121

    &.title
      color #1565C0
      align-items flex-start
      cursor pointer
      min-height 40px
      text-transform uppercase
      font-size .7em
      font-weight 900
      padding .25em .5em
      background white
      clip-path polygon(0 0, 100% 0, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0 75%)

    &.self
      grid-area self

    &.work
      grid-area work

    &.projects
      grid-area projects

    &.contact
      grid-area contact
      background #9bb4d0
      color white
      border-radius 2px
      font-weight 400
      padding .5em 1.5em
      box-shadow 0 1px 3px rgba(0, 0, 0, .12), 0 1px 2px rgba(0, 0, 0, .24)
      transition all .3s cubic-bezier(.25, .8, .25, 1)

      // &:hover
      //   box-shadow 0 14px 28px rgba(0, 0, 0, .25), 0 10px 10px rgba(0, 0, 0, .22)

      img.cross
        position absolute
        width 80px
        top -25px
        left 20px
        object-fit contain
        opacity .9
        filter drop-shadow(1px 2px 3px #212121)

      .currently_working
        position absolute
        top 41px
        left -10px
        transform rotate(-3deg)
        display flex
        flex-flow row nowrap
        width max-content
        color lighten(#212121, 20%)
        >div
          color #16B157
          font-weight 900
</style>
