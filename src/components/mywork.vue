<template lang="pug">
section.mywork
  .libs
    h1(v-anchor="'libs'") #[b My] Libraries
    .repos
      github_card(v-for="lib in libs", :lib="lib")
    h1(v-anchor="'projects'") #[b My] Portfolio
    project(
      name="Sidy"
      description="A real estate management ecosystem, with a stack made of Kubernetes & Helmfile, node.js, RedisGraph, and VueJs"
      :asset="sidy"
      color="1976D2"
      )
    project(
      name="AresRpg.world"
      description="A fancy product showcase for a game, using Figma"
      :asset="ares"
      color="FFA000"
      link="https://aresrpg.world"
      )
    project(
      name="Umara.app"
      description="A web app to upload and share high quality photoshoot, it uses Node.js, Graphql, S3, Docker, and Vue3"
      :asset="umara"
      color="5E35B1"
      link="https://umara.app"
      )
    project(
      name="PepeDefense.io"
      description="A fully decentralized tower defense, using Solidity (diamond pattern), Canvas, and Vue3"
      :asset="pepe"
      color="43A047"
      link="https://testnet.pepedefense.io"
      )
    project(
      name="Utake"
      description="A fully responsive food ordering web application, using VueJS"
      iframe="https://player.vimeo.com/video/469034001"
      color="7B1FA2"
      )
    project(
      name="Kryzos"
      description="An E-Learning platform for investing, using Vue3"
      :asset="kryzos"
      color="388E3C"
      )
    project(
      name="Pizza Restaurant"
      description="A fully responsive pizza restaurant website, using VueJS"
      :asset="panorama"
      color="d32f2f"
      )
    project(
      name="Hydre.io"
      description="An interractive page bouncing on David Guetta, using VueJS"
      :asset="hydre"
      color="388E3C"
      link="https://hydre.io"
      )
    project(
      name="XBL"
      description="A swap page for a cryptocurrency, using VueJS"
      iframe="https://player.vimeo.com/video/469023755"
      color="F9A825"
      )
    project(
      name="Mana Finance"
      description="A DeFi yield farm to brew mana potions on BSC, using React and Solidity"
      iframe="https://player.vimeo.com/video/523237645"
      color="6A1B9A"
      )
  .abstract
    .headlines
      h1 Minimal
      h1.outline & Fast
</template>

<script setup>
import sidy from '../assets/sidy.jpg'
import hydre from '../assets/hydre.jpg'
import panorama from '../assets/panorama.jpg'
import kryzos from '../assets/kryzos.jpg'
import umara from '../assets/umara.jpeg'
import pepe from '../assets/pepedefense.jpeg'
import ares from '../assets/ares.png'

import github_card from './github_card.vue'
import project from './project.vue'
import libs from './libs.js'
</script>

<style lang="stylus" scoped>
section.mywork
  width 100%
  min-height 100vh
  overflow-x hidden
  display flex
  flex-flow column nowrap
  background #eeee
  margin-top -90px
  padding-top 90px
  position relative

  .abstract
    position absolute
    top 0
    left 0
    bottom 0
    right 0

    .headlines
      position absolute
      top 40px
      right 0

      h1
        font-family 'nimbus-sans', sans-serif
        line-height .7em
        text-align end
        font-size 9em
        opacity .3

        &.outline
          -webkit-text-stroke 1px black
          color #eee

  .libs
    position relative
    z-index 2
    display flex
    flex-flow column nowrap
    padding 200px 3em 50px 120px
    width 100%

    h1
      margin-left 150px
      font-weight 900
      font-size 5em
      color #212121
      font-family 'nimbus-sans', sans-serif
      position relative
      width max-content

      &::after
        content ''
        position absolute
        bottom 0
        right 0
        width 91px
        height 10px
        background #1565C0

      b
        font-weight 300
        color #1565C0

    .repos
      padding 1em
      margin-bottom 100px
      width 100%
      padding 50px 0 0 50px
      display grid
      grid-gap 2em
      grid-template-columns repeat(auto-fit, minmax(400px, 1fr))
</style>
