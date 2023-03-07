<script setup lang="ts">
//page to create a new thread in a forum

import { computed } from "vue";
import router from "@/router";
import ThreadEditor from "@/components/ThreadEditorComponent.vue";
import { useForumsStore } from "@/stores/ForumsStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import type Forum from "@/types/Forum";

//prop
const props = defineProps({
    forumId: {
        type: String,
        required: true
    }
});

//computed data
const forum = computed(() => {
    let forumStore = useForumsStore();
    return forumStore.forums.find((forum: Forum) => forum.id === props.forumId);
});

//function to save and create a new thread
async function save(title: string, text: string) {
    let threadStore = useThreadsStore();
    let thread = await threadStore.createThread(title, text, props.forumId);
    router.push({ name: "ThreadShow", params: { id: thread?.id, slug: thread?.slug } });
}

//function to cancel a thread creation
const cancel = () => {
    router.push({ name: "Forum", params: { id: forum.value?.id, slug: forum.value?.slug } });
};
</script>

<template>
    <div class="col-full push-top">
        <h1>
            Create new thread in <i>{{ forum?.name }}</i>
        </h1>
        <!--TODO: Figure out this error-->
        <ThreadEditor @save="save" @cancel="cancel"> </ThreadEditor>
    </div>
</template>
