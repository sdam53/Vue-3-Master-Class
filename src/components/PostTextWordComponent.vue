<script setup lang="ts">
//component that will handle user referencing and links
//look at regex for requirements
//it is based on username requirments.
//Not the best way to do it tbh
//TODO: Because @ing is based on username, we may want to look into when users change their username
//maybe post object keeps track of that.

import { useUsersStore } from "@/stores/UsersStore";
import { ref } from "vue";
const usersStore = useUsersStore();

//props
const props = defineProps({
    word: {
        type: String,
        required: true //should be true but some errors show up for some reason
    }
});

//regex and userid
const usernameRegex = /(@\w[^&=_'-+,<>.:\s]+:)/g;
const userId = ref<null | string | undefined>(null);

//if the word passes the regex then we try to get the userid of that username
if (usernameRegex.test(props.word)) {
    userId.value = await usersStore.getUserId(props.word.substring(1, props.word.length - 1));
}
</script>

<template>
    <router-link v-if="userId" :to="{ name: 'ProfileUsers', params: { id: userId } }"
        >{{ props.word.substring(0, props.word.length - 1) }}
    </router-link>
    <span v-else> {{ props.word }}</span>
</template>

<style scoped lang="css"></style>
