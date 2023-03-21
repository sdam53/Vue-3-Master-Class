<script setup lang="ts">
//page to view user profile

import PostList from "@/components/PostListComponent.vue";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import UserProfileCard from "@/components/UserProfileCardComponent.vue";
import UserProfileCardEditor from "@/components/UserProfileCardEditorComponent.vue";
import type User from "@/types/User";
import { computed } from "vue";
import { useAsyncState } from "@vueuse/core";
import { getAuth } from "@firebase/auth";
import router from "@/router";

//store
const currentUserStore = useCurrentUserStore();

//emits
const emits = defineEmits(["ready"]);

//prop
const props = defineProps({
    edit: { type: Boolean, default: false }
});

//document.title = currentUserStore.username ? currentUserStore.username + "\'s Profile" : "404 User"
document.title = "My Profile"

/*
TODO: When logged in and on /me. if you refresh you will be sent to login due to 
current user not existing for a quick second.
*/
const { isReady } = useAsyncState(async () => {
    let auth = getAuth();
    let user = auth.currentUser;
    //await currentUserStore.fetchAuthUser()
    //if the user is not signed in then move them to the login page
    //if (!currentUserStore.isSignedIn) router.push({ name: 'Login' })
    setTimeout(() => {
        if (!currentUserStore.authId) router.push({ name: 'Login' })
        emits("ready")
    }, 700)
}, undefined)

isReady
</script>

<template>
    <div class="container">
        <div class="flex-grid">
            <div class="col-3 push-top">
                <UserProfileCard v-if="!props.edit" :user="currentUserStore.authUser as User" />
                <UserProfileCardEditor v-else :user="currentUserStore.authUser as User" />
            </div>
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
