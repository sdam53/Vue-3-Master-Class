//pinia store to keep track of categories

import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { useSourceDataStore } from "./SourceDataStore";

/**
 * category store
 */
export const useCategoriesStore = defineStore("CategoriesStore", () => {
    //store
    const sourceDataStore = useSourceDataStore();

    //ref
    const categories = ref(sourceDataStore.categories);

    return { categories };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCategoriesStore, import.meta.hot));
}
