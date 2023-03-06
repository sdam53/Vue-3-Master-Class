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
</script>

<template>
    <div class="container">
        <!--TODO: When not signed in, redirect to the login screen-->
        <div class="flex-grid">
            <div class="col-3 push-top">
                <!--TODO: Deal with this error-->
                <UserProfileCard :user="currentUserStore.authUser" />
                <UserProfileCardEditor :user="currentUserStore.authUser" />

                <p class="text-xsmall text-faded text-center">
                    Member since june 2003, last visited 4 hours ago
                </p>

                <div class="text-center">
                    <hr />
                    <a href="edit-profile.html" class="btn-green btn-small">Edit Profile</a>
                </div>
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
