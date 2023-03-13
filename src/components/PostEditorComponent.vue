<script setup lang="ts">
//Component for editing posts ie creating

import type Post from "@/types/Post";
import { ref, type PropType } from "vue";

//props
const props = defineProps({
    post: {
        type: Object as PropType<Post>,
        default: { text: null },
        required: false
    }
})

//emits
const emit = defineEmits(["savePost"]);

//refs
const postCopy = ref<Post>({ ...props.post })

/**
 * sends a event to the post to add a post to a thread
 */
const addPost = () => {

    emit("savePost", { ...postCopy.value }); // access under eventData
    postCopy.value.text = "";
};

</script>

<template>
    <div class="col-full">
        <form @submit.prevent="addPost">
            <div class="form-group">
                <textarea v-model="postCopy.text" id="thread_content" class="form-input" name="content" rows="8"
                    cols="140"></textarea>
            </div>
            <div class="btn-group">
                <button class="btn btn-blue">{{ post.id ? "Update Post" : "Submit Post" }}</button>
            </div>
        </form>
    </div>
</template>
