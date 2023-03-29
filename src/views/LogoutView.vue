<script setup lang="ts">
import UseLoadingScreen from "@/composables/UseLoadingScreen.vue";
import router from "@/router";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import { ref } from "vue";

//store
const currentUserStore = useCurrentUserStore();

const isReady = ref<Boolean>(true);

await currentUserStore.logout();

//kinda like when it run a bit longer
setTimeout(() => {
    router.push({ name: "Home" });
}, 1000);
</script>

<template>
    <UseLoadingScreen v-show="isReady" />
</template>

<style scoped lang="css"></style>
