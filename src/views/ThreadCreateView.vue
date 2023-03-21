<script setup lang="ts">
//page to create a new thread in a forum

import { computed, ref } from "vue";
import router from "@/router";
import ThreadEditor from "@/components/ThreadEditorComponent.vue";
import UseLoadingScreen from "@/composables/UseLoadingScreen.vue";
import { useForumsStore } from "@/stores/ForumsStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import type Forum from "@/types/Forum";
import { findById } from "@/middleware/HelperFunctions";
import { useAsyncState } from "@vueuse/core";
import { onBeforeRouteLeave } from "vue-router";

//emits
const emits = defineEmits(["ready"])

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

//refs
const formIsDirty = ref<boolean>(false)

//computed data
const forum = computed<Forum>(() => {
    return findById(forumStore.forums, props.forumId) as Forum;
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
    document.title = "Start a new thread"
    emits("ready")
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

})
</script>

<template>
    <UseLoadingScreen v-show="!isReady" />
    <div v-if="isReady" class="col-full push-top">
        <h1>
            Create new thread in <i>{{ forum?.name }}</i>
        </h1>
        <!--TODO: Figure out this error-->
        <ThreadEditor @save="save" @cancel="cancel" @dirty="formIsDirty = true" @clean="formIsDirty = false">
        </ThreadEditor>
    </div>
</template>
