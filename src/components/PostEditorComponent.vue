<script setup lang="ts">
//Component for editing posts ie creating

import { ref } from "vue";

//emits
const emit = defineEmits(["savePost"]);

//refs
const text = ref("");

/**
 * sends a event to the post to add a post to a thread
 */
const addPost = () => {
    const post = {
        text: text.value
    };
    emit("savePost", { post }); // access under eventData.post
    text.value = "";
};
</script>

<template>
    <div class="col-full">
        <form @submit.prevent="addPost">
            <div class="form-group">
                <textarea
                    id="thread_content"
                    class="form-input"
                    name="content"
                    v-model="text"
                    rows="8"
                    cols="140"
                ></textarea>
            </div>
            <div class="btn-group">
                <button class="btn btn-blue">Submit Post</button>
            </div>
        </form>
    </div>
</template>
