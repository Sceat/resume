import { createApp } from 'vue'

import App from './App.vue'
import { revealDirective } from './composables/use-reveal.js'
import { router } from './router.js'

import './styles/index.css'
import './styles/print.css'

createApp(App).use(router).directive('reveal', revealDirective).mount('#app')
