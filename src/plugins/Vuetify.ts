//vuetify stuff
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";

const customDarkTheme = {
    dark: true,
    colors: {
        background: "#15202b",
        surface: "#15202b",
        primary: "#3f51b5",
        secondary: "#03dac6",
        error: "#f44336",
        info: "#2196F3",
        success: "#4caf50",
        warning: "#fb8c00"
    }
};

const customLightTheme = {
    dark: false,
    colors: {
        background: "#FFFFFF",
        surface: "#FFFFFF",
        primary: "#6200EE",
        secondary: "#03DAC6",
        error: "#B00020",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FB8C00"
    }
};
const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: "customDarkTheme",
        themes: {
            customDarkTheme,
            customLightTheme
        }
    }
});

export { vuetify };
