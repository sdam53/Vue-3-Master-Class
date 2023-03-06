<script setup lang="ts">
import { computed, ref } from "vue";
import { useForumsStore } from "@/stores/ForumsStore";
import router from "@/router";
import { useThreadsStore } from "@/stores/ThreadsStore";
import ThreadEditor from "@/components/ThreadEditorComponent.vue";
const props = defineProps(["forumId"]);
const forum = computed(() => {
    let forumStore = useForumsStore();
    return forumStore.forums.find((forum) => forum.id === props.forumId);
});
async function save(title: string, text: string) {
    let threadStore = useThreadsStore();
    let thread = await threadStore.createThread(title, text, props.forumId);
    router.push({ name: "ThreadShow", params: { id: thread?.id, slug: thread?.slug } });
}
const cancel = () => {
    router.push({ name: "Forum", params: { id: forum.value?.id, slug: forum.value?.slug } });
};
</script>

<template>
    <div class="col-full push-top">
        <h1>
            Create new thread in <i>{{ forum?.name }}</i>
        </h1>
        <ThreadEditor @save="save" @cancel="cancel"> </ThreadEditor>
    </div>
</template>
