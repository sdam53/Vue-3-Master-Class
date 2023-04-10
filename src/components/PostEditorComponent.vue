<script setup lang="ts">
//Component for editing posts ie creating

import { PostSchema } from "@/plugins/Yup";
import type Post from "@/types/Post";
import { ErrorMessage as VeeErrorMessage, Field as VeeField, Form as VeeForm } from "vee-validate";
import { ref, type PropType } from "vue";

//props
const props = defineProps({
    post: {
        type: Object as PropType<Post>,
        default: { text: null },
        required: false
    }
});

//emits
const emit = defineEmits(["savePost"]);

//refs
const postCopy = ref<Post>({ ...props.post });

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
        <VeeForm @submit="addPost" :validation-schema="PostSchema">
            <div class="form-group">
                <VeeField
                    as="textarea"
                    v-model="postCopy.text"
                    id="thread_content"
                    class="form-input"
                    name="text"
                    rows="8"
                    cols="140"
                    :spellcheck="true"
                ></VeeField>
                <VeeErrorMessage name="text" class="form-error"></VeeErrorMessage>
            </div>
            <div class="btn-group">
                <button class="btn btn-blue">{{ post.id ? "Update Post" : "Submit Post" }}</button>
            </div>
        </VeeForm>
    </div>
</template>
