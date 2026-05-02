<template>
  <NavSection />
  <main>
    <HeroSection />
    <StatsStrip />
    <div id="about">
      <HowIWorkSection />
    </div>
    <div id="flagships">
      <FlagshipBitfinex />
      <FlagshipHytale />
      <FlagshipAresrpg />
      <FlagshipTalos />
    </div>
    <div id="more">
      <MoreProjects />
    </div>
    <div id="skills">
      <SkillsMatrix />
    </div>
    <GithubCommits />
    <div id="contact">
      <Contact />
    </div>
  </main>
  <FooterSection />
</template>

<script setup>
import NavSection from '../sections/nav.vue'
import HeroSection from '../sections/hero.vue'
import StatsStrip from '../sections/stats-strip.vue'
import HowIWorkSection from '../sections/how-i-work.vue'
import FlagshipBitfinex from '../sections/flagship-bitfinex.vue'
import FlagshipHytale from '../sections/flagship-hytale.vue'
import FlagshipAresrpg from '../sections/flagship-aresrpg.vue'
import FlagshipTalos from '../sections/flagship-talos.vue'
import MoreProjects from '../sections/more-projects.vue'
import SkillsMatrix from '../sections/skills-matrix.vue'
import GithubCommits from '../sections/github-commits.vue'
import Contact from '../sections/contact.vue'
import FooterSection from '../sections/footer.vue'
</script>
