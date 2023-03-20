//pinia store to keep track of the current user

import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";
import type Post from "@/types/Post";
import type Thread from "@/types/Thread";
import type User from "@/types/User";
import { usePostsStore } from "./PostsStore";
import { useThreadsStore } from "./ThreadsStore";
import { useUsersStore } from "./UsersStore";
import { findById, upsert } from "@/middleware/HelperFunctions";
import { getAuth } from "@firebase/auth";

/**
 * current user store
 */
export const useCurrentUserStore = defineStore("CurrentUserStore", () => {
    //stores
    const postStore = usePostsStore();
    const threadStore = useThreadsStore();
    const userStore = useUsersStore();

    //ref
    //const authId = ref("VXjpr2WHa8Ux4Bnggym8QFLdv5C3");3b2x1vGujmAe79ngvktc;HiPWtTRCQUGo377B18MS
    const authId = ref("HiPWtTRCQUGo377B18MS");
    //const authId = ref<string | null>("");

    //computed data
    const authUser = computed<User | null>(() =>
        authId.value ? (findById(userStore.users, authId.value) as User) : null
    );
    const name = computed(() => authUser.value?.name);
    const avatar = computed(() => authUser.value?.avatar);
    const username = computed(() => authUser.value?.username);
    const bio = computed(() => authUser.value?.bio);
    const website = computed(() => authUser.value?.website);
    const isSignedIn = computed(() => authUser.value && name.value);
    const posts = computed(() => {
        return postStore.posts.filter((post: Post) => post.userId === authId.value) || [];
    });
    const postsCount = computed(() => {
        //return isSignedIn.value ? authUser.value.postsCount : 0;
        return posts.value.length;
    });
    const threads = computed(() => {
        return isSignedIn.value
            ? threadStore.threads.filter((thread: Thread) => thread.userId === authId.value)
            : [];
    });
    const threadsCount = computed(() => (isSignedIn.value ? threads.value.length || 0 : 0));

    //function to update the current user
    const updateUser = (user: User) => {
        //setUser(user);
        //authUser.value = user;
    };

    /**
     * set the users auth id
     * TODO: We want to set it to null if there is no user signed in but it doesnt like it so yea
     * @param id auth id
     */
    const setAuthId = (id: string | null) => {
        authId.value = id;
    };

    /**
     * fetches the currently signed in user's auth id
     */
    function fetchAuthUser() {
        if (!authId.value) return;
        let userId = getAuth().currentUser?.uid;
        if (!userId) return;
        setAuthId(userId);
        userStore.fetchUser(authId.value);
    }

    /**
     * function to login user
     * @param email users email
     * @param password users password
     */
    async function login(email: string, password: string) {}

    /**
     * function to log out the user
     */
    async function logout() {
        await getAuth().signOut();
        setAuthId(null);
    }

    return {
        authId,
        authUser,
        isSignedIn,
        name,
        avatar,
        username,
        bio,
        website,
        posts,
        postsCount,
        threads,
        threadsCount,
        //setUser,
        updateUser,
        fetchAuthUser,
        login,
        logout
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCurrentUserStore, import.meta.hot));
}
