import { createApp, onMounted, onBeforeUnmount, ref } from 'vue'
import App from './App.vue'
import FontAwesomeIcon from "./util/icons.js";
import { anchor, anchor_scroll } from './util/anchors.js'

console.log(`%c You're curious, i like you`, 'color: #1565C0;font-weight:bold;font-size:25px;')
console.log("%c but don't bother, i'm open-source!", 'color: #1565C0;font-size:18px;')
console.log('%c https://github.com/sceat/resume', 'font-size:15px;')


createApp(App)
  .directive('anchor', anchor)
  .directive('scroll-to-anchor', anchor_scroll)
  .component('fa', FontAwesomeIcon)
  .mount('#app')