<template lang="pug">
nav
  .title__box
    span.title Sceat.xyz
  span.self My self
  span.work My work
  span.contact Hire me
</template>

<script>
export default {
  name: 'Nav',
  props: {
    msg: String
  },
  data() {
    return {
      count: 0
    }
  }
}
</script>

<style lang="stylus" scoped>
nav
  width 100vw
  // height 70px
  display grid
  grid "link void self work contact" 40px / max-content 1fr max-content max-content max-content
  padding 2em 200px

  .title__box
    filter drop-shadow(0 3px 3px rgba(0, 0, 0, .6))
    grid-area link
    cursor default

  span
    padding-right 1em
    cursor pointer
    font-weight 300
    display flex
    justify-content center
    align-items center
    &.title
      color white
      align-items flex-start
      cursor default
      min-height 40px
      text-transform uppercase
      font-size .7em
      font-weight 900
      padding .25em .5em
      background #1565C0
      clip-path polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)
    &.self
      grid-area self
    &.work
      grid-area work
    &.contact
      grid-area contact
      background #1565C0
      color white
      border-radius 50px
      font-weight 400
      padding .5em 1.5em
      box-shadow 0 1px 3px rgba(0, 0, 0, .12), 0 1px 2px rgba(0, 0, 0, .24)
      transition all .3s cubic-bezier(.25, .8, .25, 1)

      &:hover
          box-shadow 0 14px 28px rgba(0, 0, 0, .25), 0 10px 10px rgba(0, 0, 0, .22)
</style>