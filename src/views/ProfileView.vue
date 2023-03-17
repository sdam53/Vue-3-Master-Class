<script setup lang="ts">
//page to view user profile

import PostList from "@/components/PostListComponent.vue";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import UserProfileCard from "@/components/UserProfileCardComponent.vue";
import UserProfileCardEditor from "@/components/UserProfileCardEditorComponent.vue";
import router from "@/router";

//store
const currentUserStore = useCurrentUserStore();

//prop
const props = defineProps({
    edit: { type: Boolean, default: false }
});

if (!currentUserStore.isSignedIn) {
    router.push({ name: 'Login' })
}
</script>

<template>
    <div class="container">
        <!--TODO: When not signed in, redirect to the login screen-->
        <div class="flex-grid">
            <div class="col-3 push-top">
                <!--TODO: Deal with this error-->
                <UserProfileCard v-if="!props.edit" :user="currentUserStore.authUser" />
                <UserProfileCardEditor v-else :user="currentUserStore.authUser" />
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
