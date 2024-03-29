<script setup lang="ts">
//page to view signed in users profile

import PostList from "@/components/PostListComponent.vue";
import UserProfileCard from "@/components/UserProfileCardComponent.vue";
import UserProfileCardEditor from "@/components/UserProfileCardEditorComponent.vue";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import { usePostsStore } from "@/stores/PostsStore";
import type Post from "@/types/Post";
import type User from "@/types/User";
import { useAsyncState } from "@vueuse/core";
import { computed } from "vue";
import { useToast } from "vue-toastification";

//toast
const Toast = useToast();
//store
const currentUserStore = useCurrentUserStore();
const postsStore = usePostsStore();

//emits
const emits = defineEmits(["ready"]);

//prop
const props = defineProps({
    edit: { type: Boolean, default: false }
});

//computed
const lastPostFetched = computed(() => {
    if (currentUserStore.posts.length === 0) return null;
    return currentUserStore.posts[currentUserStore.posts.length - 1];
});

/**
 * function used for infiniteloading
 * depending on needs it will call for more posts, stop, or error.
 * @param state InfiniteLoad state. JSON of functions to call
 */
const load = async (state: { loaded: () => void; complete: () => void; error: () => void }) => {
    try {
        let count = await postsStore.fetchUserPosts(currentUserStore.authId as string, {
            startAfter: lastPostFetched.value as Post
        });
        if (count) state.loaded();
        else state.complete();
    } catch {
        state.error();
    }
};

/*
Not logged in is being handled in router file
*/
const { isReady } = useAsyncState(async () => {
    await currentUserStore.fetchAuthUserThreads();
    await postsStore.fetchUserPosts(currentUserStore.authId as string, {
        startAfter: lastPostFetched.value as Post
    });
    //document.title = currentUserStore.username ? currentUserStore.username + "\'s Profile" : "404 User"
    document.title = "My Profile";
    emits("ready");
}, undefined);
</script>

<template>
    <div class="container" style="width: 100%">
        <div class="flex-grid">
            <!--Profile card and editor-->
            <div class="col-3 push-top">
                <UserProfileCard v-if="!props.edit" :id="currentUserStore.authId as string" />
                <UserProfileCardEditor v-else :user="currentUserStore.authUser as User" />
            </div>
            <!--Shows user posts-->
            <div class="col-7 push-top">
                <div class="profile-header">
                    <span class="text-lead">
                        {{ currentUserStore.username }}'s recent activity
                    </span>
                    <a @click="Toast.error('This feature isn\'t supported :(')"
                        >See only started threads?</a
                    >
                </div>
                <hr />
                <PostList :posts="currentUserStore.posts" />
                <!--Infinite loading of posts-->
                <InfiniteLoading :slots="{ complete: ' ' }" @infinite="load" />
            </div>
        </div>
    </div>
</template>
