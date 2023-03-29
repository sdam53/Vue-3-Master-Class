//https://fontawesome.com/docs/web/use-with/vue/add-icons
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCamera, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { App } from "vue";
library.add(faPencilAlt, faCamera);

const FontAwesome = (app: App<Element>) => {
    app.component("fa", FontAwesomeIcon); //fa is what you use to call it in template
};

export { FontAwesome };
