import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useSourceDataStore } from "./SourceDataStore";

export const useUsersStore = defineStore("UsersStore", () => {
    const sourceDataStore = useSourceDataStore();

    const users = ref(sourceDataStore.users);

    return { users };
});
