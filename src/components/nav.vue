<template lang="pug">
mixin nav
  span#enter.self(@click="scroll_to_section(1)", :class="selected(1)") About me
  span#enter.work(@click="scroll_to_section(2.5)", :class="selected(2)") Portfolio

transition(name="appear")
  nav.side(v-if="state.hidden")
    span.home(@click="scroll_to_section(0)", :class="selected(0)") Home
    +nav
nav.top
  .title__box(@click="scroll_to_section(0)")
    span#enter.title Sceat.xyz
  +nav
  span#enter.contact Hire me
</template>

<script>
import { onMounted, onBeforeUnmount, reactive } from "vue";
import anime from "animejs";

export default {
  name: "Nav",
  setup() {
    const state = reactive({ hidden: false, selected: 0 });
    const scroll = (top) => window.scrollTo({ top, behavior: "smooth" });
    const on_scroll = () => {
      const { scrollY } = window;
      if (state.hidden && scrollY < 100) state.hidden = false;
      else if (!state.hidden && scrollY > 100) state.hidden = true;

      const section = Math.round(window.scrollY / window.innerHeight);
      if (state.selected !== section) state.selected = section;
    };
    onMounted(() => {
      window.addEventListener("scroll", on_scroll, { passive: true });
      anime({
        targets: [".top #enter"],
        translateX: [-40, 0],
        opacity: [0, 1],
        delay: anime.stagger(100, { start: 400 }),
        easing: "easeOutCirc",
        duration: 600,
      });
    });
    onBeforeUnmount(() => window.removeEventListener("scroll", on_scroll));
    return {
      scroll_to_section: (num) => scroll(window.innerHeight * num),
      state,
      selected: (index) => ({ selected: index === state.selected }),
    };
  },
};
</script>

<style lang="stylus" scoped>
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
    cursor pointer
    position relative
    font-weight 300
    font-size .75em
    text-transform uppercase
    margin-top .5em
    will-change opacity

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
  grid 'link void self work contact' 40px / max-content 1fr max-content max-content max-content
  padding 2em 200px
  z-index 5

  .title__box
    filter drop-shadow(0 3px 3px rgba(0, 0, 0, .6))
    grid-area link
    cursor pointer

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
      cursor pointer
      min-height 40px
      text-transform uppercase
      font-size .7em
      font-weight 900
      padding .25em .5em
      background #1565C0
      clip-path polygon(0 0, 100% 0, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0 75%)

    &.self
      grid-area self

    &.work
      grid-area work

    &.contact
      grid-area contact
      background #1565C0
      color white
      border-radius 2px
      font-weight 400
      padding .5em 1.5em
      box-shadow 0 1px 3px rgba(0, 0, 0, .12), 0 1px 2px rgba(0, 0, 0, .24)
      transition all .3s cubic-bezier(.25, .8, .25, 1)

      &:hover
        box-shadow 0 14px 28px rgba(0, 0, 0, .25), 0 10px 10px rgba(0, 0, 0, .22)
</style>