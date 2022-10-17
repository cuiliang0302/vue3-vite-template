import {createApp} from "vue";
import App from "./App.vue";
import "@/styles/normalize.css";
import "@/styles/hover-min.css";
import "@/styles/index.scss";
import "element-plus/theme-chalk/src/message.scss"
import router from '@/router';
import pinia from "@/store/index";
import 'vue-loaders/dist/vue-loaders.css';
import VueLoaders from 'vue-loaders';
const app = createApp(App);
app.use(router)
app.use(pinia)
app.use(VueLoaders)
app.mount("#app");
