<template lang="pug">
section.mywork
  .libs
    h1(v-anchor="'libs'") #[b My] Libraries
    .repos
      github_card(v-for="project in projects", :project="project")
    h1(v-anchor="'projects'") #[b My] Projects
    sidy
    utake
    kryzos
    panorama
    hydre
    xbl
    mana
  .abstract
    .headlines
      h1 Minimal
      h1.outline & Fast
</template>

<script>
import github_card from './github_card.vue'
import projects from './projects.js'
import { onBeforeMount, onBeforeUnmount, ref } from 'vue'

import hydre from './projects/hydre.vue'
import panorama from './projects/panorama.vue'
import sidy from './projects/sidy.vue'
import utake from './projects/utake.vue'
import xbl from './projects/xbl.vue'
import mana from './projects/mana.vue'
import kryzos from './projects/kryzos.vue'

export default {
  components: {
    github_card,
    hydre,
    panorama,
    sidy,
    utake,
    xbl,
    mana,
    kryzos,
  },
  setup() {
    return {
      projects,
    }
  },
}
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
