<script setup lang="ts">
import { computed, ref } from "vue";
import { useForumsStore } from "@/stores/ForumsStore";
import router from "@/router";
import { useThreadsStore } from "@/stores/ThreadsStore";
const props = defineProps(["forumId"]);
const title = ref("");
const text = ref("");
async function save() {
    let threadStore = useThreadsStore();
    let thread = await threadStore.createThread(title.value, text.value, props.forumId);
    router.push({ name: "ThreadShow", params: { id: thread?.id, slug: thread?.slug } });
}
const forum = computed(() => {
    let forumStore = useForumsStore();
    return forumStore.forums.find((forum) => forum.id === props.forumId);
});
</script>

<template>
    <div class="col-full push-top">
        <h1>
            Create new thread in <i>{{ forum?.name }}</i>
        </h1>

        <form @submit.prevent="save">
            <div class="form-group">
                <label for="thread_title">Title:</label>
                <input
                    v-model="title"
                    type="text"
                    id="thread_title"
                    class="form-input"
                    name="title"
                />
            </div>

            <div class="form-group">
                <label for="thread_content">Content:</label>
                <textarea
                    v-model="text"
                    id="thread_content"
                    class="form-input"
                    name="content"
                    rows="8"
                    cols="140"
                ></textarea>
            </div>

            <div class="btn-group">
                <button class="btn btn-ghost">Cancel</button>
                <button class="btn btn-blue" type="submit" name="Publish">Publish</button>
            </div>
        </form>
    </div>
</template>
