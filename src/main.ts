import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router/index";
import AppDate from "@/components/AppDate.vue";
import { FontAwesome } from "@/plugins/FontAwesome";
import { vuetify } from "@/plugins/Vuetify";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config/firebase";
import { getAuth } from "@firebase/auth";
import { useCurrentUserStore } from "./stores/CurrentUserStore";

const firebase = initializeApp(firebaseConfig);
//allows for logins to persist even after browser refreshes
getAuth().onAuthStateChanged((user) => {
    if (user) {
        let currentUserStore = useCurrentUserStore();
        currentUserStore.fetchAuthUser();
    }
});

const pinia = createPinia();
const app = createApp(App);

//use pinia for glabal state management
app.use(pinia);
//this allows us to glablly use a component without importing it
app.component("AppDate", AppDate);
//use our router we made
app.use(router);
//using vuetify
app.use(vuetify);
//using fontawesome
app.use(FontAwesome);
app.mount("#app");
