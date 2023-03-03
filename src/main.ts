import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router/index";
import AppDate from "@/components/AppDate.vue";
import "./assets/style.css";

const pinia = createPinia();
const app = createApp(App);

//use pinia for glabal state management
app.use(pinia);
//this allows us to glablly use a component without importing it
app.component("AppDate", AppDate);
//use our router we made
app.use(router);

app.mount("#app");
