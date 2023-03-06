import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";
import sourceData from "@/data.json";
import type Post from "@/types/Post";
import type Thread from "@/types/Thread";
import { usePostsStore } from "./PostsStore";
import { useThreadsStore } from "./ThreadsStore";
import { useUsersStore } from "./UsersStore";
import type User from "@/types/User";

export const useCurrentUserStore = defineStore("CurrentUserStore", () => {
    const postStore = usePostsStore();
    const threadStore = useThreadsStore();
    const userStore = useUsersStore();

    const authId = ref("VXjpr2WHa8Ux4Bnggym8QFLdv5C3");
    const authUser = computed(() => sourceData.users.find((user) => user.id === authId.value));

    const name = computed(() => authUser.value?.name);
    const avatar = computed(() => authUser.value?.avatar);
    const username = computed(() => authUser.value?.username);
    const bio = computed(() => authUser.value?.bio);
    const website = computed(() => authUser.value?.website);

    const isSignedIn = computed(() => authUser.value != null);

    const posts = computed(() => {
        return postStore.posts.filter((post: Post) => post.userId === authId.value);
    });
    const postsCount = computed(() => {
        return posts.value.length;
    });
    const threads = computed(() => {
        return threadStore.threads.filter((thread: Thread) => thread.userId === authId.value);
    });
    const threadsCount = computed(() => threads.value.length);

    const setUser = (user: User, userId: string) => {
        const userIndex = userStore.users.findIndex((user: User) => user.id === userId);
        userStore.users[userIndex] = { ...user };
    };

    const updateUser = (user: User) => {
        setUser(user, authId.value);
    };

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
        setUser,
        updateUser
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCurrentUserStore, import.meta.hot));
}
