// @ts-nocheck
//TODO: import of firebase error
import AppDate from "@/components/AppDate.vue";
import { FontAwesome } from "@/plugins/FontAwesome";
import { vuetify } from "@/plugins/Vuetify";
import { Vue3ProgressPlugin } from "@marcoschulte/vue3-progress";
import { initializeApp } from "firebase/app";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import { firebaseConfig } from "./config/firebase";
import { InfiniteLoad } from "./plugins/InfiniteLoading";
import PageScrollDirective from "./plugins/PageScrollDirective";
import { Toast, ToastOptions } from "./plugins/Toastification";
import router from "./router/index";

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
//custom directive for page scrolling
app.use(PageScrollDirective);
//page infinite scrolling
app.use(InfiniteLoad);
//toast
app.use(Toast, ToastOptions);
app.mount("#app");
