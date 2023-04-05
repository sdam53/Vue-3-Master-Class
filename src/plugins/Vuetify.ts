//vuetify stuff
import { createVuetify } from "vuetify";
import "vuetify/styles";

//font awesome stuff

const vuetify = createVuetify({
    theme: {
        defaultTheme: "light" //requires changing alot of things due to using external css and stuff
    }
});

export { vuetify };
