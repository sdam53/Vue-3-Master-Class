<script setup lang="ts">
//component for thread editing

import { threadCreateAndEditSchema } from "@/plugins/Yup";
import { cloneDeep } from "lodash";
import { ErrorMessage as VeeErrorMessage, Field as VeeField, Form as VeeForm } from "vee-validate";
import { computed, ref, watch } from "vue";

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
const emit = defineEmits(["save", "cancel", "dirty", "clean"]);

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
    emit("clean");
    emit("save", form.value.title, form.value.text);
};

/**
 * sends an event to cancel the edit
 */
const cancel = () => {
    emit("cancel", {});
};

/**
 * watch changes in form
 * using lodash clonedeep function to watch
 * if you dont old val and new are referencing the same and will not work right
 */
watch(
    () => cloneDeep(form),
    (newValue, oldValue) => {
        if (
            newValue.value.title !== oldValue.value.title ||
            newValue.value.text !== oldValue.value.text
        ) {
            emit("dirty");
        } else {
            emit("clean");
        }
    }
);
</script>

<template>
    <VeeForm @submit="save" :validation-schema="threadCreateAndEditSchema">
        <div class="form-group">
            <label for="thread_title">Title:</label>
            <VeeField
                v-model="form.title"
                type="text"
                id="thread_title"
                class="form-input"
                name="title"
            />
            <VeeErrorMessage name="title" class="form-error"></VeeErrorMessage>
        </div>

        <div class="form-group">
            <label for="thread_content">Content:</label>
            <VeeField
                as="textarea"
                v-model="form.text"
                id="thread_content"
                class="form-input"
                name="text"
                rows="8"
                cols="140"
            ></VeeField>
            <VeeErrorMessage name="text" class="form-error"></VeeErrorMessage>
        </div>

        <div class="btn-group">
            <button class="btn btn-ghost" @click.prevent="cancel">Cancel</button>
            <button class="btn btn-blue" type="submit" name="Publish">
                {{ existing ? "Update" : "Publish" }}
            </button>
        </div>
    </VeeForm>
</template>
