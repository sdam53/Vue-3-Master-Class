//https://fontawesome.com/docs/web/use-with/vue/add-icons
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
library.add(faPencilAlt);

const FontAwesome = (app) => {
    app.component("font-awesome-icon", FontAwesomeIcon);
};

export { FontAwesome };
