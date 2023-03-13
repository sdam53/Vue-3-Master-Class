<script setup lang="ts">
//component to display a list of posts in a thread

import { findById } from "@/middleware/HelperFunctions";
import { useUsersStore } from "@/stores/UsersStore";
import { usePostsStore } from "@/stores/PostsStore";
import type Post from "@/types/Post";
import type User from "@/types/User";

//props
const props = defineProps(["posts"]);

//store
const userStore = useUsersStore();
const postStore = usePostsStore();

/**
 * returns users based on their id
 * @param userId
 */
const userById = (userId: string) => {
    return findById(userStore.users, userId);
};

/**
 * makes the userstore make a request to get user, which then gets saved
 * @param userId userid
 */
async function getUser(userId: string) {
    let user = await userStore.fetchUser(userId);
    return user as User;
}
</script>

<template>
    <div class="post-list">
        <div class="post" v-for="post in props.posts" :key="post.id">
            <div v-if="userById(post.userId)" class="user-info">
                <a href="#" class="user-name">{{ userById(post.userId)!.name }}</a>
                <a href="#">
                    <img class="avatar-large" :src="userById(post.userId)!.avatar" alt="" />
                </a>
                <!-- This will make non stop calls to DB
                        <p class="desktop-only text-small">{{ getUser(post.userId).postsCount }} posts</p>
                        <p class="desktop-only text-small">{{ getUser(post.userId).threadsCount }} threads</p>
                    -->
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
