<template lang="pug">
section.myself
  .text__box
    h1(v-anchor="'about'" ref="h1_ref") Building APIs and open-source #[b solutions] for more than 8 years
    span
      | Years of programming experience that can #[b serve you]. #[br]
      | Highly skilled CTO with #[b proven field experience], I write #[a(href="https://nodejs.org/en/about/", target="_blank") Node.js] and
      |          #[a(href="https://graphql.org/", target="_blank") GraphQL]
      | APIs to provide tech companies with an efficient and #[b outstanding growth].
      | Through a self-taught background, I spent thousands of hours perfecting my
      | skills to #[b help you] gain an unfair advantage over your competitors.#[br]#[br]
      | I manage projects from #[a(href="https://en.wikipedia.org/wiki/Proof_of_concept", target="_blank") POC] to production release and handle the whole
      | conception of services including #[a(href="https://v3.vuejs.org/", target="_blank") Vue.js] applications,
      |          #[a(href="https://www.docker.com/", target="_blank") containerization], #[a(href="https://www.mongodb.com/", target="_blank") NoSQL]
      | or in memory database like #[a(href="https://oss.redislabs.com/redisgraph/", target="_blank") RedisGraph]
      | or #[a(href="https://neo4j.com/", target="_blank") Neo4J], #[a(href="https://caddyserver.com/v2", target="_blank") web servers] or
      |          #[a(href="https://www.netlify.com/", target="_blank") CDNs], #[a(href="https://kubernetes.io/", target="_blank") Kubernetes] schedulers
      | with tools like #[a(href="https://github.com/roboll/helmfile", target="_blank") Helmfile] and
      |          #[a(href="https://git-scm.com/", target="_blank") Git] automated workflows.#[br]#[br]
      | You can find many of my own JavaScript libraries and open source tools on my #[a(href="https://github.com/Sceat", target="_blank") GitHub profile]
    span.nft I also create smart-contract and front-end dApp for your DeFi or NFT projects
    .skills
      .commits
        .icon(ref="tween_ref")
          fa(icon="file-code")
        span.num {{ Math.round(numbers.commits) }}+
        span.title Commits
        span.desc pushed
      .issues
        .icon
          fa(icon="bug")
        span.num {{ Math.round(numbers.issues) }}+
        span.title Issues
        span.desc created
      .pr
        .icon
          fa(icon="code-branch")
        span.num {{ Math.round(numbers.prs) }}+
        span.title Pull requests
        span.desc opened
      .reviews
        .icon
          fa(icon="code-branch")
        span.num {{ Math.round(numbers.reviews) }}+
        span.title Pull requests
        span.desc reviewed
  .ads
    q I've mastered the ability of writing so incredibly still that bugs became invisible to the eye
  .features
    - var n = 0;
    - var z = 0;
    .dots
      while n++ < 100
        .dot
    .small__dots
      while z++ < 100
        .dot
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, reactive } from 'vue'
import anime from 'animejs'
import TWEEN from '@tweenjs/tween.js'

let frame_handler

const h1_ref = ref(null)
const tween_ref = ref(null)
const trigerred = ref(false)
const tween_trigerred = ref(false)
const offset = ref(0)
const numbers = reactive({
  commits: 0,
  issues: 0,
  prs: 0,
  reviews: 0,
})
const tweened = new TWEEN.Tween(numbers)
  .to(
    {
      commits: 7200,
      issues: 330,
      prs: 120,
      reviews: 70,
    },
    1500
  )
  .easing(TWEEN.Easing.Quadratic.InOut)
  .onComplete(() => cancelAnimationFrame(frame_handler))
const animate = function (currentTime) {
  TWEEN.update(currentTime)
  frame_handler = requestAnimationFrame(animate)
}

const observer = new IntersectionObserver(
  ([entries]) => {
    if (trigerred.value) return
    if (entries.isIntersecting) {
      trigerred.value = true
      anime({
        targets: ['.text__box h1'],
        translateX: [40, 0],
        opacity: [0, 0.8],
        delay: 200,
        duration: 500,
        easing: 'easeOutCirc',
      })
      anime({
        targets: ['.text__box span'],
        translateX: [40, 0],
        opacity: [0, 0.8],
        delay: 600,
        duration: 500,
        easing: 'easeOutCirc',
      })
    }
  },
  { threshold: [0] }
)

const tween_observer = new IntersectionObserver(
  ([entries]) => {
    if (tween_trigerred.value) return
    if (entries.isIntersecting) {
      tween_trigerred.value = true

      tweened.start()
      frame_handler = requestAnimationFrame(animate)
    }
  },
  { threshold: [0] }
)

const handle_scroll = () => {}

onMounted(() => {
  observer.observe(h1_ref.value)
  tween_observer.observe(tween_ref.value)
  document.addEventListener('scroll', handle_scroll)
})
onBeforeUnmount(() => {
  observer.disconnect()
  tween_observer.disconnect()
  document.removeEventListener('scroll', handle_scroll)
})
</script>

<style lang="stylus" scoped>
a
  color #eee
  font-weight 400
  font-family 'nimbus-sans', sans-serif

span.nft
  color #EC407A
  font-weight 900
  text-shadow 1px 2px 3px black
  padding .25em !important

section.myself
  width 100%
  min-height 100vh
  background #212121
  display flex
  flex-flow row nowrap
  color #eee
  position relative
  z-index 5
  overflow hidden
  clip-path polygon(0 0, 100% 0, 100% 95%, 0 100%)

  .features
    position absolute
    top 0
    left 0
    right 0
    bottom 0

    .dots
      display grid
      grid-template-rows repeat(10, 1fr)
      grid-auto-flow column
      grid-gap 40px
      width max-content
      position absolute
      bottom 30%
      right -2px

      .dot
        opacity .1
        width 5px
        border-radius 2px
        height @width
        background white

    .small__dots
      display grid
      grid-template-rows repeat(10, 1fr)
      grid-auto-flow column
      grid-gap 20px
      width max-content
      position absolute
      bottom 50%
      right 350px

      .dot
        opacity .1
        width 5px
        border-radius 2px
        height @width
        background white

  .ads
    margin-top 200px
    padding 2em
    display flex
    flex-flow column nowrap

  .text__box
    margin 120px
    width 80%
    padding 1.5em
    display flex
    flex-flow column nowrap
    position relative
    z-index 2
    border-left dashed 1px rgba(#eee .2)
    align-items center

    .skills
      display flex
      flex-flow row wrap
      justify-content center
      align-items center

      >div
        position relative
        display grid
        grid 'icon num title' 1fr 'icon num desc' 1fr / 1fr max-content max-content
        grid-column-gap .25em
        padding 1em

        .icon
          width 50px
          height @width
          grid-area icon
          place-self center center
          background rgba(#424242, .4)
          border-radius 20px
          margin 0 1em
          display flex
          justify-content center

          svg
            width 20px
            filter drop-shadow(1px 2px 3px black)

        .num
          grid-area num
          font-size 1.5em
          font-weight 900

        .title
          grid-area title
          font-size 1.1em
          place-self end start

        .desc
          grid-area desc
          font-size .8em
          font-weight 100
          place-self start start
          text-transform uppercase

        &.commits
          .icon
            svg
              color #1976D2

        &.issues
          .icon
            svg
              color #1976D2

        &.pr
          .icon
            svg
              color #1976D2

        &.reviews
          .icon
            svg
              color #1976D2

    h1
      opacity 0
      font-size 4.5em
      max-width 700px
      font-family 'nimbus-sans', sans-serif
      align-self flex-start

      b
        color #1976D2

    >span
      letter-spacing 1.3px
      opacity 0
      font-family 'nimbus-sans', sans-serif
      padding 2em
      text-align justify
      max-width 800px

      b
        font-weight 900

q
  quotes '“' '”' '‘' '’'
  font-family Caveat
  font-size 1.8em
  width 250px
  margin-right 1em
  opacity .6

q::before
  content open-quote

q::after
  content close-quote
</style>
