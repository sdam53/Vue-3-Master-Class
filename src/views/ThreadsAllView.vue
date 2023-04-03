<script setup lang="ts">
import ThreadList from "@/components/ThreadListComponent.vue";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { useUsersStore } from "@/stores/UsersStore";
import type Thread from "@/types/Thread";
import { useAsyncState } from "@vueuse/core";
import { difference } from "lodash";
import { computed } from "vue";

//stores
const threadsStore = useThreadsStore();
const usersStore = useUsersStore();

//emits
const emits = defineEmits(["ready"]);

//computed
const threads = computed(() => threadsStore.threads);
const lastThreadFetched = computed<Thread | null>(() =>
    threadsStore.threads.length === 0 ? null : threadsStore.threads[threadsStore.threads.length - 1]
);

/**
 * function used for infiniteloading
 * depending on needs it will call for more posts, stop, or error.
 * @param state InfiniteLoad state. JSON of functions to call
 */
const load = async (state: { loaded: () => void; complete: () => void; error: () => void }) => {
    try {
        //need to also fetch user, which difference method makes easy
        const pastUsers = threadsStore.threads.map((thread) => thread.userId);
        let count = await threadsStore.fetchAllThreads({ startAfter: lastThreadFetched.value });
        const allUsers = threadsStore.threads.map((thread) => thread.userId);
        const newUsers = difference(allUsers, pastUsers);
        await usersStore.fetchUsers(newUsers);
        if (count) state.loaded();
        else state.complete();
    } catch {
        state.error();
    }
};

const { isReady } = useAsyncState(async () => {
    threadsStore.clearThreads(); //clear all thread cache
    await threadsStore.fetchAllThreads({ startAfter: lastThreadFetched.value });
    await usersStore.fetchUsers(threads.value.map((thread) => thread.userId));
    document.title = "Threads";
    emits("ready");
}, undefined);
</script>

<template>
    <div v-if="isReady" class="col-full push-top">
        <ThreadList :threads="threads" />
        <InfiniteLoading :slots="{ complete: ' ' }" @infinite="load" />
    </div>
</template>
