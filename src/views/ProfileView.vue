<script setup lang="ts">
import { ref, computed } from "vue";
import PostList from "@/components/PostListComponent.vue";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import { usePostsStore } from "@/stores/PostsStore";
import { useThreadsStore } from "@/stores/ThreadsStore";

const currentUserStore = useCurrentUserStore();
const postStore = usePostsStore();
const threadStore = useThreadsStore();

const userPosts = computed(() => {
    return postStore.posts.filter((post) => post.userId === currentUserStore.authId);
});
const userPostsCount = computed(() => {
    return userPosts.value.length;
});

const userThreads = computed(() => {
    return threadStore.threads.filter((thread) => thread.userId === currentUserStore.authId);
});
const userThreadsCount = computed(() => userThreads.value.length);
</script>

<template>
    <div class="container">
        <!--TODO: When not signed in, redirect to the login screen-->
        <div class="flex-grid">
            <div class="col-3 push-top">
                <div class="profile-card">
                    <p class="text-center">
                        <img
                            :src="currentUserStore.avatar"
                            :alt="`${currentUserStore.name} profile picture`"
                            class="avatar-xlarge"
                        />
                    </p>

                    <h1 class="title">{{ currentUserStore.username }}</h1>

                    <p class="text-lead">{{ currentUserStore.name }}</p>

                    <p class="text-justify">{{ currentUserStore.bio || "No bio specified." }}</p>

                    <span class="online">{{ currentUserStore.username }} is online</span>

                    <div class="stats">
                        <span>{{ userPostsCount }} posts</span>
                        <span>{{ userThreadsCount }} threads</span>
                    </div>

                    <hr />

                    <p v-if="currentUserStore.website" class="text-large text-center">
                        <i class="fa fa-globe"></i>
                        <a :href="currentUserStore.website">{{ currentUserStore.website }}</a>
                    </p>
                </div>

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
                <PostList :posts="userPosts" />
            </div>
        </div>
    </div>
</template>
