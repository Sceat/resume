<template lang="pug">
section.myself
  .text__box
    h1(ref="h1_ref") Building APIs and Open-source #[b solutions] since more than #[b 6 years]
    span
      | Years of programming experience that can #[b serve you]. #[br]
      | Highly skilled CTO with #[b proven field experience], I write #[a(href="https://nodejs.org/en/about/", target="_blank") Node.js] and
      | #[a(href="https://graphql.org/", target="_blank") GraphQL]
      | APIs to provide tech companies with an efficient and #[b outstanding growth].
      | Through a self-taught background i spent thousand of hours perfectionning my
      | skills to #[b help you] gain an unfair advantage over your concurrents.#[br]#[br]
      | I manage projects from #[a(href="https://en.wikipedia.org/wiki/Proof_of_concept", target="_blank") POC] to production release and handle the whole
      | conception of services including #[a(href="https://v3.vuejs.org/", target="_blank") Vue.js] applications,
      | #[a(href="https://www.docker.com/", target="_blank") containerization], #[a(href="https://www.mongodb.com/", target="_blank") NoSql]
      | or in memory database like #[a(href="https://oss.redislabs.com/redisgraph/", target="_blank") Redisgraph]
      | or #[a(href="https://neo4j.com/", target="_blank") Neo4J], #[a(href="https://caddyserver.com/v2", target="_blank") web servers] or
      | #[a(href="https://www.netlify.com/", target="_blank") CDNs], #[a(href="https://kubernetes.io/", target="_blank") Kubernetes] schedulers
      | with tools like #[a(href="https://github.com/roboll/helmfile", target="_blank") Helmfile] and
      | #[a(href="https://git-scm.com/", target="_blank") Git] automated workflows.#[br]#[br]
      | You can find many of my own JavaScript libraries and open source tools on my #[a(href="https://github.com/Sceat", target="_blank") GitHub profile]
    .skills
      .commits 5000+ Commits
      .issues 330+ Issues created
      .pr 80+ Pull requests opened
      .reviews 50+ Pull request reviewed
  .ads
    q I've mastered the ability of writing so incredibly still that bugs became invisible to the eye
  img(src="/src/assets/circle.png")

</template>

<script>
import { onMounted, onBeforeUnmount, ref } from "vue";
import anime from "animejs";

export default {
  setup() {
    const h1_ref = ref(null);
    const trigerred = ref(false);

    const observer = new IntersectionObserver(
      ([entries]) => {
        if (trigerred.value) return;
        if (entries.isIntersecting) {
          trigerred.value = true;
          anime({
            targets: [".text__box h1"],
            translateX: [40, 0],
            opacity: [0, 1],
            delay: anime.stagger(50, { start: 200 }),
            duration: 500,
            easing: "easeOutCirc",
          });
          anime({
            targets: [".text__box span"],
            translateX: [40, 0],
            opacity: [0, 1],
            delay: anime.stagger(50, { start: 200 }),
            duration: 500,
            easing: "easeOutCirc",
          });
        }
      },
      { threshold: [0] }
    );

    onMounted(() => observer.observe(h1_ref.value));
    onBeforeUnmount(() => observer.disconnect());

    return { h1_ref };
  },
};
</script>

<style lang="stylus" scoped>
a
  text-decoration underline

section.myself
  width 100%
  min-height 100vh
  background #212121
  display flex
  flex-flow row nowrap
  color #eee
  position relative
  overflow hidden

  img
    position absolute
    top 0
    left 0
    width 100vw
    height 100vh
    opacity .3
    object-fit cover
    filter saturate(.5)
    transform rotate(180deg)

  .ads
    margin-top 200px
    padding 2em
    display flex
    flex-flow column nowrap

  .text__box
    margin 100px
    width 80%
    padding 2em
    display flex
    flex-flow column nowrap
    position relative
    z-index 2

    h1
      opacity 0
      font-size 3em
      font-family 'Roboto Slab', serif

      b
        color #CE93D8

    span
      letter-spacing 1.3px
      opacity 0
      font-family 'Roboto Slab', serif
      padding 2em

      b
        font-weight 900

q
  quotes '“' '”' '‘' '’'
  font-family Caveat
  font-size 1.8em
  width 250px
  margin-right 1em

q::before
  content open-quote

q::after
  content close-quote
</style>