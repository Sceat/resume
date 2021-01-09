<template lang="pug">
section.mywork
  .left
  .right
  .abstract
    .headlines
      h1 Minimal
      h1.outline & Fast
</template>

<style lang="stylus" scoped>
.mywork
  width 100%
  min-height 100vh
  overflow-x hidden
  display flex
  flex-flow row nowrap
  background #eee
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
  .left
    width 300px
  .right
    width 100%

</style>