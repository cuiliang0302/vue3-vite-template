import {createApp} from "vue";
import App from "./App.vue";
import "@/styles/normalize.css";
import "@/styles/hover-min.css";
import "@/styles/index.scss";
import "element-plus/theme-chalk/src/message.scss"
import { registerStore } from '@/store';
import router from '@/router';
import { createPinia } from 'pinia';
import 'vue-loaders/dist/vue-loaders.css';
import VueLoaders from 'vue-loaders';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const app = createApp(App);
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
registerStore();
app.use(router)
app.use(VueLoaders)
app.mount("#app");
