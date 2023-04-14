<script setup lang="ts">
import PostTextWord from "@/components/PostTextWordComponent.vue";
import { useUsersStore } from "@/stores/UsersStore";
const props = defineProps({
    text: {
        type: String,
        required: false //should be true but some errors show up for some reason
    }
});

//const text = ref(props.text);

const usersStore = useUsersStore();

//regex to catch @username:
//thus i am reducing the username rules a bit
//() allows the split to keep the demiliters
const usernameRegex = /(@\w[^&=_'-+,<>.:\s]+:)/g;
//const arr = props?.text?.match(usernameRegex);

const arr = props?.text?.split(usernameRegex);

async function getID(username: string) {
    return await usersStore.getUserId(username.substring(1, username.length - 1));
}
</script>

<template>
    <template v-for="(word, i) in arr" :key="i">
        <PostTextWord :word="word"></PostTextWord>
    </template>
</template>

<style scoped lang="css"></style>
