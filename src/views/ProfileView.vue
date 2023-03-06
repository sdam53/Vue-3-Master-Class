<script setup lang="ts">
import { ref, computed } from "vue";
import PostList from "@/components/PostListComponent.vue";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import { usePostsStore } from "@/stores/PostsStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import type Post from "@/types/Post";
import UserProfileCard from "@/components/UserProfileCardComponent.vue";
import UserProfileCardEditor from "@/components/UserProfileCardEditorComponent.vue";

const currentUserStore = useCurrentUserStore();

const props = defineProps({
    edit: { type: Boolean, default: false }
});
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
                    <span class="text-lead"> Joker's recent activity </span>
                    <a href="#">See only started threads?</a>
                </div>
                <hr />
                <PostList :posts="currentUserStore.posts" />
            </div>
        </div>
    </div>
</template>
