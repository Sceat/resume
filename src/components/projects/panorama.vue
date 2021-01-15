<template lang="pug">
section.utake
  .text
    h2 Pizza landing page
    span A fully responsive pizza restaurant website
  .demo
    img(src="/src/assets/panorama.jpg")
</template>

<style lang="stylus" scoped>
section.utake
  border-left 2px dashed #d32f2f
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
    margin-top 2em
    img
      filter drop-shadow(1px 2px 3px black)
      border-radius 10px
      overflow hidden
</style>