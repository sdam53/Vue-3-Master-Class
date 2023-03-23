import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router/index";
import AppDate from "@/components/AppDate.vue";
import { FontAwesome } from "@/plugins/FontAwesome";
import { vuetify } from "@/plugins/Vuetify";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config/firebase";
import { Vue3ProgressPlugin } from "@marcoschulte/vue3-progress";

const firebase = initializeApp(firebaseConfig);

const pinia = createPinia();
const theRouter = router;
const app = createApp(App);

//use pinia for glabal state management
app.use(pinia);
//this allows us to glablly use a component without importing it
app.component("AppDate", AppDate);
//using vuetify
app.use(vuetify);
//using fontawesome
app.use(FontAwesome);
//vue3 top loading bar
app.use(Vue3ProgressPlugin);
//use our router we made
app.use(theRouter);
app.mount("#app");
