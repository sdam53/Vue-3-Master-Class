<script setup lang="ts">
import { ref } from "vue";

const props = defineProps(["title", "text"]);
const emit = defineEmits(["save", "cancel"]);

const form = ref({
    title: props.title,
    text: props.text
});

const save = () => {
    emit("save", form.value.title, form.value.text);
};
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
            <button class="btn btn-blue" type="submit" name="Publish">Publish</button>
        </div>
    </form>
</template>
