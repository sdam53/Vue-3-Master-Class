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
        defaultTheme: "dark" //requires changing alot of things due to using external css and stuff
    }
});

export { vuetify };
