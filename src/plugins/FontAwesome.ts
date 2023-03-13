//https://fontawesome.com/docs/web/use-with/vue/add-icons
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import type { App } from "vue";
library.add(faPencilAlt);

const FontAwesome = (app: App<Element>) => {
    app.component("fa", FontAwesomeIcon); //fa is what you use to call it in template
};

export { FontAwesome };
