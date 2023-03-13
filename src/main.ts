import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router/index";
import AppDate from "@/components/AppDate.vue";

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config/firebase";

//vuetify stuff
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

//font awesome stuff

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        //defaultTheme: "dark" //requires changing alot of things due to using external css and stuff
    }
});

const firebase = initializeApp(firebaseConfig);

const pinia = createPinia();
const app = createApp(App);

//https://fontawesome.com/docs/web/use-with/vue/add-icons
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
library.add(faPencilAlt);

//use pinia for glabal state management
app.use(pinia);
//this allows us to glablly use a component without importing it
app.component("AppDate", AppDate);
//use our router we made
app.use(router);
//using vuetify
app.use(vuetify);
//using fontawesome
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
