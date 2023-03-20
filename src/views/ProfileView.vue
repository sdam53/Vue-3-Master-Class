<script setup lang="ts">
//page to view user profile

import PostList from "@/components/PostListComponent.vue";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import UserProfileCard from "@/components/UserProfileCardComponent.vue";
import UserProfileCardEditor from "@/components/UserProfileCardEditorComponent.vue";
import router from "@/router";
import type User from "@/types/User";
import { computed } from "vue";

//store
const currentUserStore = useCurrentUserStore();

//prop
const props = defineProps({
    edit: { type: Boolean, default: false }
});

//if the user is not signed in then move them to the login page
if (!currentUserStore.isSignedIn) {
    router.push({ name: 'Login' })
}

//document.title = currentUserStore.username ? currentUserStore.username + "\'s Profile" : "404 User"
document.title = "My Profile"
</script>

<template>
    <div class="container">
        <!--TODO: When not signed in, redirect to the login screen-->
        <div class="flex-grid">
            <div class="col-3 push-top">
                <!--TODO: Deal with this error-->
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
