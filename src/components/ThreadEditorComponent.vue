<script setup lang="ts">
//component for thread editing

import { ref, computed } from "vue";

//props
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

//emits
const emit = defineEmits(["save", "cancel"]);

//refs
const form = ref({
    title: props.title,
    text: props.text
});

//computed data
const existing = computed(() => !!props.title); //cast to boolean

/**
 * sends an event to the ThreadEditView page to save the edit
 */
const save = () => {
    emit("save", form.value.title, form.value.text);
};

/**
 * sends an event to cancel the edit
 */
const cancel = () => {
    emit("cancel", {});
};
</script>

<template>
    <form @submit.prevent="save">
        <div class="form-group">
            <label for="thread_title">Title:</label>
            <input
                v-model="form.title"
                type="text"
                id="thread_title"
                class="form-input"
                name="title"
            />
        </div>

        <div class="form-group">
            <label for="thread_content">Content:</label>
            <textarea
                v-model="form.text"
                id="thread_content"
                class="form-input"
                name="content"
                rows="8"
                cols="140"
            ></textarea>
        </div>

        <div class="btn-group">
            <button class="btn btn-ghost" @click.prevent="cancel">Cancel</button>
            <button class="btn btn-blue" type="submit" name="Publish">
                {{ existing ? "Update" : "Publish" }}
            </button>
        </div>
    </form>
</template>
