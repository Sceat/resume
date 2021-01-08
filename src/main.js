import { createApp } from 'vue'
import App from './App.vue'
import FontAwesomeIcon from "./util/icons.js";

createApp(App)
  .component('fa', FontAwesomeIcon)
  .mount('#app')
