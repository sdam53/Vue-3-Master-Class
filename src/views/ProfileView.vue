<script setup lang="ts">
//page to view user profile

import PostList from "@/components/PostListComponent.vue";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import UserProfileCard from "@/components/UserProfileCardComponent.vue";
import UserProfileCardEditor from "@/components/UserProfileCardEditorComponent.vue";
import type User from "@/types/User";
import { useAsyncState } from "@vueuse/core";
import { getAuth } from "@firebase/auth";

//store
const currentUserStore = useCurrentUserStore();

//emits
const emits = defineEmits(["ready"]);

//prop
const props = defineProps({
    edit: { type: Boolean, default: false }
});

//document.title = currentUserStore.username ? currentUserStore.username + "\'s Profile" : "404 User"
document.title = "My Profile";

/*
Not logged in is being handled in router file 
*/
const { isReady } = useAsyncState(async () => {
    await currentUserStore.fetchAuthUserThreads();
    await currentUserStore.fetchAuthUserPosts();
    emits("ready");
}, undefined);

isReady;
</script>

<template>
    <div class="container" style="width: 100%">
        <div class="flex-grid">
            <!--Profile card and editor-->
            <div class="col-3 push-top">
                <UserProfileCard v-if="!props.edit" :user="currentUserStore.authUser as User" />
                <UserProfileCardEditor v-else :user="currentUserStore.authUser as User" />
            </div>
            <!--Shows user posts-->
            <div class="col-7 push-top">
                <div class="profile-header">
                    <span class="text-lead">
                        {{ currentUserStore.username }}'s recent activity
                    </span>
                    <a href="#">See only started threads?</a>
                </div>
                <hr />
                <PostList :posts="currentUserStore.posts" />
            </div>
        </div>
    </div>
</template>
