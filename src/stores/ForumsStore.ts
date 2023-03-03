import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useSourceDataStore } from "./SourceDataStore";

export const useForumsStore = defineStore("ForumsStore", () => {
    const sourceDataStore = useSourceDataStore();

    const forums = ref(sourceDataStore.forums);

    return { forums };
});
