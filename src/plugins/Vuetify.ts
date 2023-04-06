//vuetify stuff
import { createVuetify } from "vuetify";
import "vuetify/styles";

import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

const vuetify = createVuetify({
    icons: {
        defaultSet: "mdi",
        aliases,
        sets: {
            mdi
        }
    },
    theme: {
        defaultTheme: "light" //requires changing alot of things due to using external css and stuff
    }
});

export { vuetify };
