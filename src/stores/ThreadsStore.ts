import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useSourceDataStore } from "./SourceDataStore";

export const useThreadsStore = defineStore("ThreadsStore", () => {
    const sourceDataStore = useSourceDataStore();

    const threads = ref(sourceDataStore.threads);

    return { threads };
});
