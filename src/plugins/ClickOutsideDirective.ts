/**
 * Custom vue directive
 * ie v-if and stuff
 * just import and use in main.ts
 * https://vuejs.org/guide/reusability/custom-directives.html#introduction
 */

import type { App } from "vue";

const ClickOutsideDirective = {
    //element is type ElementTarget i think
    mounted(element: any, binding: any) {
        element.__clickOutsideHandler__ = (e: Event) => {
            if (!(element === e.target || element.contains(e.target))) {
                binding.value(e);
            }
        };
        document.body.addEventListener("click", element.__clickOutsideHandler__);
    },
    unmounted(element: any) {
        document.body.removeEventListener("click", element.__clickOutsideHandler__);
    }
};

export default (app: App) => {
    app.directive("click-outside", ClickOutsideDirective);
};
