<script setup lang="ts">
import { ref, defineEmits } from "vue";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";

const currentUser = useCurrentUserStore();
const text = ref("");
const emit = defineEmits(["addPost"]);
const addPost = () => {
    const post = {
        text: text.value
    };
    //TODO: Figure out this error with save post
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
