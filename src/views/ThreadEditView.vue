<script setup lang="ts">
//page to edit a thread

import { computed } from "vue";
import router from "@/router";
import ThreadEditor from "@/components/ThreadEditorComponent.vue";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { usePostsStore } from "@/stores/PostsStore";
import type Thread from "@/types/Thread";
import { findById } from "@/middleware/HelperFunctions";

//props
const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

//stores
let threadStore = useThreadsStore();
let postStore = usePostsStore();

//computed data
const thread = computed(() => {
    return findById(threadStore.threads, props.id);
});
const text = computed(() => {
    return findById(postStore.posts, thread.value?.posts[0])?.text || "";
});

//function to save changes
async function save(title: string, text: string) {
    let thread = await threadStore.updateThread(title, text, props.id);
    router.push({ name: "ThreadShow", params: { id: thread?.id, slug: thread?.slug } });
}

//function to cancel changes
const cancel = () => {
    router.push({ name: "ThreadShow", params: { id: thread.value?.id, slug: thread.value?.slug } });
};

async function created() {
    if (thread.value === undefined) {
        await threadStore.fetchThread(props.id);
        await postStore.fetchPost(thread.value?.posts[0]);
    }
}
await created();
</script>

<template>
    <div v-if="thread && text" class="col-full push-top">
        <h1>
            Editing <i>{{ thread?.title }}</i>
        </h1>
        <ThreadEditor :title="thread?.title || ''" :text="text" @save="save" @cancel="cancel">
        </ThreadEditor>
    </div>
</template>
