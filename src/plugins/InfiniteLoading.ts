//https://www.npmjs.com/package/v3-infinite-loading
//https://github.com/oumoussa98/vue3-infinite-loading/tree/main/docs/api
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import type { App } from "vue";

const InfiniteLoad = (app: App<Element>) => {
    app.component("InfiniteLoading", InfiniteLoading);
};

export { InfiniteLoad };
