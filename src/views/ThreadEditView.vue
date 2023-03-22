<script setup lang="ts">
//page to edit a thread

import { computed, ref } from "vue";
import router from "@/router";
import ThreadEditor from "@/components/ThreadEditorComponent.vue";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { usePostsStore } from "@/stores/PostsStore";
import type Thread from "@/types/Thread";
import { findById } from "@/middleware/HelperFunctions";
import { useAsyncState } from "@vueuse/core";
import type Post from "@/types/Post";
import { onBeforeRouteLeave } from "vue-router";

//emits
const emits = defineEmits(["ready"]);

//props
const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

//refs
const formIsDirty = ref<boolean>(false);

//stores
let threadStore = useThreadsStore();
let postStore = usePostsStore();

//computed data
const thread = computed<Thread>(() => {
    return findById(threadStore.threads, props.id) as Thread;
});
const text = computed<string>(() => {
    let post: Post = findById(postStore.posts, thread.value?.posts[0]) as Post
    return post ? post.text : "";
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

const { isReady } = useAsyncState(async () => {
    if (thread.value === undefined) {
        await threadStore.fetchThread(props.id);
        await postStore.fetchPost(thread.value?.posts[0]);
    }
    document.title = `Editing '${thread.value.title}'`;
    emits("ready");
}, undefined);

/**
 * prevents the user from leaving the page by accident and risk losing changes.
 */
onBeforeRouteLeave((to, from) => {
    if (formIsDirty.value) {
        const answer = window.confirm(
            'Do you really want to leave? you have unsaved changes!'
        )
        // cancel the navigation and stay on the same page
        if (!answer) return false
    }
});

</script>

<template>
    <div v-if="isReady" class="col-full push-top">
        <h1>
            Editing <i>{{ thread?.title }}</i>
        </h1>
        <ThreadEditor :title="thread?.title || ''" :text="text" @save="save" @cancel="cancel" @dirty="formIsDirty = true"
            @clean="formIsDirty = false">
        </ThreadEditor>
    </div>
</template>
