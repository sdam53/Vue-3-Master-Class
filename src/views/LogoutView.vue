<script setup lang="ts">
import { ref } from "vue";
import UseLoadingScreen from "@/composables/UseLoadingScreen.vue";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import router from "@/router";

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
