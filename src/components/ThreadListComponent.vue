<script setup lang="ts">
//component to display a list of threads

import { findById } from "@/middleware/HelperFunctions";
import { usePostsStore } from "@/stores/PostsStore";
import { useUsersStore } from "@/stores/UsersStore";
import type Post from "@/types/Post";
import type Thread from "@/types/Thread";
import type User from "@/types/User";
import type { PropType } from "vue"; //used to set props with objects
import { reactive } from "vue";
import AppAvatar from "./AppAvatar.vue";

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
const posts = reactive<Post[]>(postsStore.posts);
const users = reactive<User[]>(usersStore.users);

/**
 * gets a user based on id
 * @param userId userid
 * @returns the user
 */
function userById(userId: string) {
    return findById(users, userId) as User;
}
</script>

<template>
    <div class="col-full">
        <div class="thread-list">
            <h2 class="list-title">Threads</h2>

            <div v-for="thread in threads" :key="thread.id" class="thread">
                <div>
                    <p>
                        <router-link
                            :to="{
                                name: 'ThreadShow',
                                params: { id: thread.id, slug: thread.slug }
                            }"
                            >{{ thread.title }}</router-link
                        >
                    </p>
                    <p class="text-faded text-xsmall">
                        By <a href="#">{{ userById(thread.userId)?.name }}</a
                        >, <AppDate :timestamp="thread.publishedAt" />.
                    </p>
                </div>

                <div class="activity">
                    <p class="replies-count">{{ thread.posts.length }} replies</p>
                    <router-link
                        v-if="userById(thread.userId)?.id"
                        :to="{ name: 'ProfileUsers', params: { id: userById(thread.userId)?.id } }"
                    >
                        <AppAvatar
                            class="avatar-medium"
                            :src="userById(thread.userId)?.avatar as string"
                            alt=""
                        />

                        <div>
                            <p class="text-xsmall">
                                <a href="#">{{ userById(thread.userId)?.name }}</a>
                            </p>
                            <p class="text-xsmall text-faded">
                                <AppDate :timestamp="thread.publishedAt" />
                            </p>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
