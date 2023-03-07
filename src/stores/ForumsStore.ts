//pinia store to keep track of the forums

import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { useSourceDataStore } from "./SourceDataStore";

/**
 * forums store
 */
export const useForumsStore = defineStore("ForumsStore", () => {
    //store
    const sourceDataStore = useSourceDataStore();

    //ref
    const forums = ref(sourceDataStore.forums);

    return { forums };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useForumsStore, import.meta.hot));
}
