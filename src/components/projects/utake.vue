<template lang="pug">
section.utake
  .text
    h2 Utake.io
    span A fully responsive food ordering web application
  .demo
    iframe(src="https://player.vimeo.com/video/469034001" width="1080" height="720" frameborder="0" allow="autoplay; fullscreen; picture-in-picture")
</template>

<style lang="stylus" scoped>
section.utake
  border-left 2px dashed #7B1FA2
  margin 3em
  padding-left 2em
  h2
    text-transform uppercase
    font-weight 400
    font-size 2em
    margin-bottom .5em
  span
    opacity .8
    font-weight 300
  .demo
    display flex
    justify-content center
    align-items center
    iframe
      filter drop-shadow(1px 2px 3px black)
      border-radius 10px
      overflow hidden
      width 1080px
      height 720px
</style>