import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useSourceDataStore } from "./SourceDataStore";

export const useCategoriesStore = defineStore("CategoriesStore", () => {
    const sourceDataStore = useSourceDataStore();
    const categories = ref(sourceDataStore.categories);

    return { categories };
});
