<script setup lang="ts">
//page to create a new thread in a forum

import { computed } from "vue";
import router from "@/router";
import ThreadEditor from "@/components/ThreadEditorComponent.vue";
import UseLoadingScreen from "@/composables/UseLoadingScreen.vue";
import { useForumsStore } from "@/stores/ForumsStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import type Forum from "@/types/Forum";
import { findById } from "@/middleware/HelperFunctions";
import { useAsyncState } from "@vueuse/core";

//prop
const props = defineProps({
    forumId: {
        type: String,
        required: true
    }
});

//stores
let forumStore = useForumsStore();
let threadStore = useThreadsStore();

//computed data
const forum = computed(() => {
    return findById(forumStore.forums, props.forumId);
});

//function to save and create a new thread
async function save(title: string, text: string) {
    let thread = await threadStore.createThread(title, text, props.forumId);
    router.push({ name: "ThreadShow", params: { id: thread?.id, slug: thread?.slug } });
}

//function to cancel a thread creation
const cancel = () => {
    router.push({ name: "Forum", params: { id: forum.value?.id, slug: forum.value?.slug } });
};

const { isReady } = useAsyncState(async () => {
    if (forum.value === undefined) {
        await forumStore.fetchForum(props.forumId);
    }
}, undefined);

</script>

<template>
    <UseLoadingScreen v-show="!isReady" />
    <div v-if="isReady" class="col-full push-top">
        <h1>
            Create new thread in <i>{{ forum?.name }}</i>
        </h1>
        <!--TODO: Figure out this error-->
        <ThreadEditor @save="save" @cancel="cancel"> </ThreadEditor>
    </div>
</template>
