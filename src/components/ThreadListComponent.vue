<script setup lang="ts">
//component to display a list of threads

import { reactive } from "vue";
import { useUsersStore } from "@/stores/UsersStore";
import { usePostsStore } from "@/stores/PostsStore";
import type { PropType } from "vue"; //used to set props with objects
import type Thread from "@/types/Thread";
import { findById } from "@/middleware/HelperFunctions";

//props
//being used regardless of it saying no
const props = defineProps({
    threads: {
        type: Array as PropType<Thread[]>,
        required: true
    }
});

//stores
const usersStore = useUsersStore();
const postsStore = usePostsStore();

//refs
const posts = reactive(postsStore.posts);
const users = reactive(usersStore.users);

/**
 * gets a post based on id
 * @param postId the postid
 */
function postById(postId: string) {
    return findById(posts, postId);
}

/**
 * gets a user based on id
 * @param userId userid
 */
function userById(userId: string) {
    return findById(users, userId);
}
</script>

<template>
    <div class="col-full">
        <div class="thread-list">
            <h2 class="list-title">Threads</h2>

            <div v-for="thread in threads" :key="thread.id" class="thread">
                <div>
                    <p>
                        <router-link :to="{
                            name: 'ThreadShow',
                            params: { id: thread.id, slug: thread.slug }
                        }">{{ thread.title }}</router-link>
                    </p>
                    <p class="text-faded text-xsmall">
                        By <a href="#">{{ userById(thread.userId)?.name }}</a>,
                        <AppDate :timestamp="thread.publishedAt" />.
                    </p>
                </div>

                <div class="activity">
                    <p class="replies-count">{{ thread.posts.length }} replies</p>

                    <img class="avatar-medium" :src="userById(thread.userId)?.avatar" alt="" />

                    <div>
                        <p class="text-xsmall">
                            <a href="#">{{ userById(thread.userId)?.name }}</a>
                        </p>
                        <p class="text-xsmall text-faded">
                            <AppDate :timestamp="thread.publishedAt" />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
