<template lang="pug">
footer
  span From #[b Tahiti]
  span Speaking #[b French] & #[b English]
  span Made by #[b me] using #[a(href="https://v3.vuejs.org/") Vue.JS 3]
</template>

<style lang="stylus" scoped>
footer
  width 100%
  background #212121
  color #eee
  display flex
  flex-flow row nowrap
  justify-content space-evenly
  align-items center
  padding 1em
  font-weight 300
  a
    color inherit
    text-decoration underline
    font-weight 400
  b
    color #FFCA28
</style>
