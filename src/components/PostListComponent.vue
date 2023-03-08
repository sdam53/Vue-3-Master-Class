<script setup lang="ts">
//component to display a list of posts in a thread

import { findById } from "@/middleware/HelperFunctions";
import { useUsersStore } from "@/stores/UsersStore.js";

//props
const props = defineProps(["posts"]);

//store
const userStore = useUsersStore();

/**
 * returns users based on their id
 * @param userId
 */
const userById = (userId: string) => {
    return findById(userStore.users, userId);
};
</script>

<template>
    <div class="post-list">
        <div class="post" v-for="post in props.posts" :key="post.id">
            <div class="user-info">
                <a href="#" class="user-name">{{ userById(post.userId)!.name }}</a>
                <a href="#">
                    <img class="avatar-large" :src="userById(post.userId)!.avatar" alt="" />
                </a>
                <p class="desktop-only text-small">
                    {{ userStore.getUserPostCount(post.userId) }} posts
                </p>
            </div>
            <div class="post-content">
                <div>
                    <p>
                        {{ post.text }}
                    </p>
                </div>
            </div>
            <div class="post-date text-faded">
                <AppDate :timestamp="post.publishedAt" />
            </div>
        </div>
    </div>
</template>
