import { createApp } from 'vue'
import store from '@/store/index.js'
import 'normalize.css'
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

const app = createApp(App).use(router)
// app.use(ElementPlus)
app.use(store)

app.mount('#app')
