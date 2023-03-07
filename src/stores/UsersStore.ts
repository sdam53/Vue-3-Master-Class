//pinia store to keep track of users

import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { useSourceDataStore } from "./SourceDataStore";

/**
 * user store
 */
export const useUsersStore = defineStore("UsersStore", () => {
    //store
    const sourceDataStore = useSourceDataStore();

    //ref
    const users = ref(sourceDataStore.users);

    return { users };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot));
}
