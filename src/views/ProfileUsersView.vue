<script setup lang="ts">
//page to view users profiles

import PostList from "@/components/PostListComponent.vue";
import UserProfileCard from "@/components/UserProfileCardComponent.vue";
import { usePostsStore } from "@/stores/PostsStore";
import { useUsersStore } from "@/stores/UsersStore";
import type Post from "@/types/Post";
import type User from "@/types/User";
import { useAsyncState } from "@vueuse/core";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

//route
const router = useRouter();
const route = useRoute();

//stores
const usersStore = useUsersStore();
const postsStore = usePostsStore();

//emits
const emits = defineEmits(["ready"]);

//props
const props = defineProps({
    id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: false
    }
});

//computed
const user = computed<User>(() => (usersStore.getUser(props.id) as User) || null);
const posts = computed<Post[]>(
    () => postsStore.posts.filter((post: Post) => post.userId === props.id) || []
);
const lastPostFetched = computed(() => {
    if (posts.value.length === 0) return null;
    return posts.value[posts.value.length - 1];
});

/**
 * function used for infiniteloading
 * depending on needs it will call for more posts, stop, or error.
 * @param state InfiniteLoad state. JSON of functions to call
 */
const load = async (state: { loaded: () => void; complete: () => void; error: () => void }) => {
    try {
        let count = await postsStore.fetchUserPosts(props.id as string, {
            startAfter: lastPostFetched.value as Post
        });
        if (count) state.loaded();
        else state.complete();
    } catch {
        state.error();
    }
};

const { isReady } = useAsyncState(async () => {
    await usersStore.fetchUser(props.id);
    await postsStore.fetchUserPosts(props.id as string, {
        startAfter: lastPostFetched.value as Post
    });
    isOnValidPage();
    document.title = `${user.value?.username}'s Profile`;
    emits("ready");
}, undefined);

/**
 * redirects if invalid user or username/no username in url
 */
const isOnValidPage = async () => {
    if (!(await usersStore.userExist(props.id)) || !user.value) {
        router.push({ name: "NotFound" });
    }
    if (!route.params.username || route.params.username !== user.value.username) {
        router.push({
            name: "ProfileUsers",
            params: { id: props.id, username: user.value.username }
        });
    }
};
</script>

<template>
    <div class="container" style="width: 100%">
        <div class="flex-grid">
            <!--Profile card and editor-->
            <div class="col-3 push-top">
                <UserProfileCard :id="props.id" />
            </div>
            <!--Shows user posts-->
            <div class="col-7 push-top">
                <div class="profile-header">
                    <span class="text-lead"> {{ user?.username }}'s recent activity </span>
                    <a href="#">See only started threads?</a>
                </div>
                <hr />
                <PostList :posts="posts" />
                <!--Infinite loading of posts-->
                <InfiniteLoading :slots="{ complete: ' ' }" @infinite="load" />
            </div>
        </div>
    </div>
</template>
