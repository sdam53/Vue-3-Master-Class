<script setup lang="ts">
//page to show list of threads in a forum. Basically child of category and parent of threads
import ThreadList from "@/components/ThreadListComponent.vue";
import { defineProps, computed } from "vue";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { useForumsStore } from "@/stores/ForumsStore";

const threadsStore = useThreadsStore();
const forumsStore = useForumsStore();

const props = defineProps(["id", "slug"]);

const threads = computed(() => {
    return threadsStore.threads.filter((thread) => thread.forumId === props.id);
});
const forum = computed(() => {
    return forumsStore.forums.find((forum) => forum.id === props.id);
});
</script>

<template>
    <div class="col-full push-top">
        <div class="forum-header">
            <div class="forum-details">
                <h1>{{ forum?.name }}</h1>
                <p class="text-lead">{{ forum?.description }}</p>
            </div>
            <router-link
                :to="{ name: 'ThreadCreate', params: { forumId: forum?.id } }"
                class="btn-green btn-small"
                >Start a thread</router-link
            >
        </div>
    </div>

    <div class="col-full push-top">
        <ThreadList :threads="threads" />
    </div>
</template>

<style scoped></style>
