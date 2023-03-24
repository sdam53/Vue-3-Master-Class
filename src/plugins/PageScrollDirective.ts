/**
 * Custom vue directive
 * ie v-if and stuff
 * just import and use in main.ts
 * https://vuejs.org/guide/reusability/custom-directives.html#introduction
 */

import type { App } from "vue";
import debounce from "lodash/debounce";

const PageScrollDirective = {
    mounted(el: any, binding: any) {
        el.__PageScroll__ = debounce(
            () => {
                binding.value();
            },
            200,
            { leading: true }
        );
        document.addEventListener("scroll", el.__PageScroll__);
    },
    unmounted(el: any) {
        document.removeEventListener("scroll", el.__PageScroll__);
    }
};
export default (app: App) => {
    app.directive("page-scroll", PageScrollDirective);
};
