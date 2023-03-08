//pinia store to keep track of users

import { findById } from "@/middleware/HelperFunctions";
import type Post from "@/types/Post";
import type User from "@/types/User";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { usePostsStore } from "./PostsStore";
import { useSourceDataStore } from "./SourceDataStore";

/**
 * user store
 */
export const useUsersStore = defineStore("UsersStore", () => {
    //store
    const sourceDataStore = useSourceDataStore();
    const postStore = usePostsStore();

    //ref
    const users = ref(sourceDataStore.users);

    //function to get specific user
    const getUser = (userId: string): User | null => {
        return findById(users.value, userId);
    };

    return { users, getUser };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot));
}
