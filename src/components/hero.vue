<template lang="pug">
section.hero
  .bg
  .left
    Sorb.orb
    .bar
    a.pdf(target="_blank" href="/cv.pdf" download="Cyril Morlet CV.pdf") Download My CV
    .icons
      a(href="https://github.com/sceat", target="_blank")
        fa.fa(icon="github-alt", type="fab", size="lg")
      a(href="https://stackoverflow.com/users/10632388/sceat", target="_blank")
        fa.fa(icon="stack-overflow", type="fab", size="lg")
  .right
    #anim.iam #[h1 H]#[h1 e]#[h1 l]#[h1 l]#[h1 o] #[span I] #[span am] #[b C]#[b y]#[b r]#[b i]#[b l],
    #sub.iam.lighter Senior fullstack engineer and CTO
    .sub
      .bar
      .ido(ref="ido")
    a#cta.cta(href="mailto:fetch@sceat.xyz") Let's Talk
  img(src="/src/assets/resume.png")
  .bounce(@click.native="scroll_down()")
    span Explore
    fa.icon(icon="long-arrow-alt-down")
</template>

<script setup>
import { onMounted, ref } from 'vue'
import anime from 'animejs'
import Typewriter from 'typewriter-effect/dist/core'

import Sorb from './orb.vue'

const ido = ref()

onMounted(() => {
  anime({
    targets: ['#anim *'],
    rotate: ['-90deg', 0],
    opacity: [0, 1],
    delay: anime.stagger(50, { start: 200 }),
    duration: 300,
    easing: 'easeOutCirc',
  })

  anime({
    targets: ['#sub'],
    translateX: [-40, 0],
    opacity: [0, 1],
    delay: 500,
    duration: 800,
    easing: 'easeOutCirc',
  })

  anime({
    targets: ['#cta'],
    translateX: [-40, 0],
    opacity: [0, 1],
    delay: 1200,
    duration: 1000,
    easing: 'easeOutCirc',
  })

  const typewriter = new Typewriter(ido.value, {
    loop: true,
    delay: 1,
    deleteSpeed: 1,
  })

  typewriter
    .typeString(
      'I create <strong style="color: #D32F2F;">Node.JS</strong> services and <strong style="color: #388E3C;">Docker</strong> infrastructures'
    )
    .pauseFor(2000)
    .deleteChars('Docker infrastructures'.length)
    .typeString(
      '<strong style="color: #8E24AA;">Solidity</strong> Smart contracts'
    )
    .pauseFor(2000)
    .deleteChars('Solidity Smart contracts'.length)
    .typeString(
      '<strong style="color: #3949AB;">Web2</strong>/<strong style="color: #FFB300;">Web3</strong> applications'
    )
    .pauseFor(2000)
    // .typeString(
    //   '<strong>only <span style="color: #27ae60;">5kb</span> Gzipped!</strong>'
    // )
    .start()
})

const scroll_down = () => {
  window.scrollTo({
    top: window.innerHeight,
    behavior: 'smooth',
  })
}
</script>

<style lang="stylus" scoped>

h1
  font-family "nimbus-sans", sans-serif

#anim
  >*
    display inline-block

@keyframes bounce
  from, 20%, 53%, 80%, to
    animation-timing-function cubic-bezier(.215, .61, .355, 1)
    transform translate3d(0, 0, 0)

  40%, 43%
    animation-timing-function cubic-bezier(.755, .05, .855, .06)
    transform translate3d(0, -30px, 0)

  70%
    animation-timing-function cubic-bezier(.755, .05, .855, .06)
    transform translate3d(0, -15px, 0)

  90%
    transform translate3d(0, -4px, 0)

.bounce
  animation bounce 7s ease-in infinite
  width 15px
  position absolute
  opacity .7
  bottom 50px
  color #212121
  left 50%
  transform translateX(-50%)
  cursor pointer
  display flex
  justify-content center
  align-items center
  flex-flow column nowrap
  span
    font-family 'Caveat'
    font-size 1.5em


.bar
  height 140px
  width 1px
  background #212121
  margin-bottom 2em

b
  font-family 'Caveat'
  font-weight 300

.orb
  position absolute
  bottom 200px
  left 100px
  z-index 1

section.hero
  width 100%
  overflow hidden
  padding 2em 200px
  position relative
  min-height 600px
  height calc(100vh - 112px)
  display flex
  flex-flow row nowrap
  background #eee

  img
    height 650px
    position absolute
    bottom 0
    right 0
    transition all 600ms ease-in-out
    @media screen and (max-width: 1300px)
      right -200px

  .right
    width 100%
    display flex
    flex-flow column nowrap
    justify-content center
    padding-left 20%
    transform translateY(-15%)
    margin-right 180px

    .cta
      text-decoration none
      padding 1em 2em
      margin-top 4em
      border-radius 1px
      background #1565C0
      width 200px
      opacity 0
      text-align center
      align-self center
      color white
      box-shadow 0 1px 3px rgba(0, 0, 0, .12), 0 1px 2px rgba(0, 0, 0, .24)
      transition all .3s cubic-bezier(.25, .8, .25, 1)
      cursor pointer
      font-weight 600

      &:hover
        box-shadow 0 14px 28px rgba(0, 0, 0, .25), 0 10px 10px rgba(0, 0, 0, .22)

    .iam
      display inline-block
      font-size 4em
      font-weight 300
      cursor default
      width max-content

      &.lighter
        width auto
        font-size 2.5em

      b
        font-size 1.2em
        color #1565C0
      h1
        font-size 1.2em

    .sub
      display flex
      flex-flow row nowrap
      margin-top 4em
      height 50px
      align-items center
      cursor default

      .bar
        height 100%
        margin 0

      .ido
        font-size 1.2em
        max-width 700px
        padding-left 2.5em
        font-weight 300

        span
          font-weight 500
          // color white
          // background gold
          // box-shadow 1px 2px 3px black

  .bg
    position absolute
    top 0
    left 0
    width 100vw
    height 100vh
    background url('/curve_2.png') center / cover
    opacity .4

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
      &.pdf
        text-decoration none
        transform rotateZ(-90deg)
        letter-spacing 3px
        margin 130px 0
        white-space nowrap
        cursor pointer
        &:hover
          text-decoration underline

    .icons
      display flex
      flex-flow column nowrap

      .fa
        width 20px
        padding-bottom 1em
</style>
