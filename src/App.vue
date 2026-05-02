<template>
  <TerminalChrome>
    <RouterView />
  </TerminalChrome>
  <PostFx />
  <CommandPalette />
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

import TerminalChrome from './components/terminal-chrome.vue'
import PostFx from './components/post-fx.vue'
import CommandPalette from './components/command-palette.vue'
import { installCommandPaletteHotkeys } from './composables/use-command-palette.js'

let unbindHotkeys = () => {}

onMounted(() => {
  unbindHotkeys = installCommandPaletteHotkeys()
})

onBeforeUnmount(() => {
  unbindHotkeys()
})
</script>
