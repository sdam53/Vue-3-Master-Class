<script setup lang="ts">
//page to show list of threads in a forum. Basically child of category and parent of threads
import ThreadList from "@/components/ThreadListComponent.vue";
import UseLoadingScreen from "@/composables/UseLoadingScreen.vue";
import { defineProps, computed, nextTick } from "vue";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { useForumsStore } from "@/stores/ForumsStore";
import { findById } from "@/middleware/HelperFunctions";
import type Forum from "@/types/Forum";
import { useUsersStore } from "@/stores/UsersStore";
import { useAsyncState } from "@vueuse/core";
import type Thread from "@/types/Thread";

//stores
const threadsStore = useThreadsStore();
const forumsStore = useForumsStore();
const usersStore = useUsersStore();

//props
const props = defineProps({
    id: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: false
    }
});

//computed data
const threads = computed<Thread[]>(() => {
    if (!forum.value) return [];
    return threadsStore.threads.filter((thread) => thread.forumId === props.id) as Thread[];
});
const forum = computed<Forum>(() => {
    return findById(forumsStore.forums, props.id) as Forum;
});

const { isReady } = useAsyncState(async () => {
    //fetch the forum
    let forum: Forum = await forumsStore.fetchForum(props.id);
    await threadsStore.fetchThreads(forum.threads);
    usersStore.fetchUsers(threads.value.map((thread) => thread.userId));
    document.title = forum.name;

}, undefined);
</script>

<template>
    <UseLoadingScreen v-show="!isReady" />
    <div v-if="isReady" class="col-full push-top">
        <div class="forum-header">
            <div class="forum-details">
                <h1>{{ forum?.name }}</h1>
                <p class="text-lead">{{ forum?.description }}</p>
            </div>
            <router-link :to="{ name: 'ThreadCreate', params: { forumId: forum?.id } }" class="btn-green btn-small">Start a
                thread</router-link>
        </div>
    </div>

    <div v-if="isReady" class="col-full push-top">
        <ThreadList :threads="threads" />
    </div>
</template>

<style scoped></style>
