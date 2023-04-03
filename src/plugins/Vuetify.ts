//vuetify stuff
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";

//font awesome stuff

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: "light" //requires changing alot of things due to using external css and stuff
    }
});

export { vuetify };
