<script setup lang="ts">
import { computed, ref } from "vue";
import router from "@/router";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { usePostsStore } from "@/stores/PostsStore";
import ThreadEditor from "@/components/ThreadEditorComponent.vue";
import type Thread from "@/types/Thread";

const props = defineProps(["id"]);

const thread = computed(() => {
    let threadStore = useThreadsStore();
    return threadStore.threads.find((thread: Thread) => thread.id === props.id);
});
const text = computed(() => {
    let postStore = usePostsStore();
    return postStore.posts.find((post) => post.id === thread.value?.posts[0])?.text;
});

async function save(title: string, text: string) {
    let threadStore = useThreadsStore();
    let thread = await threadStore.updateThread(title, text, props.id);
    router.push({ name: "ThreadShow", params: { id: thread?.id, slug: thread?.slug } });
}
const cancel = () => {
    router.push({ name: "ThreadShow", params: { id: thread.value?.id, slug: thread.value?.slug } });
};
</script>

<template>
    <div class="col-full push-top">
        <h1>
            Editing <i>{{ thread?.title }}</i>
        </h1>
        <ThreadEditor :title="thread?.title" :text="text" @save="save" @cancel="cancel">
        </ThreadEditor>
    </div>
</template>

const currentUserStore = useCurrentUserStore(); const forumStore = useForumsStore(); const
usersStore = useUsersStore(); const postStore = usePostsStore();
