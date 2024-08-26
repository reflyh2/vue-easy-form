import { createApp } from 'vue'
import App from './App.vue'
import VueEasyForm from '@reflyh2/vue-easy-form'
import './assets/tailwind.css'

const app = createApp(App)
app.use(VueEasyForm)
app.mount('#app')