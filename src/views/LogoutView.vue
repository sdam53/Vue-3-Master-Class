<script setup lang='ts'>
import { ref } from "vue";
import UseLoadingScreen from "@/composables/UseLoadingScreen.vue";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import router from "@/router";

//store
const currentUserStore = useCurrentUserStore()

const isReady = ref<Boolean>(false)

await currentUserStore.logout()

router.push({ name: "Home" })

</script>

<template>
    <UseLoadingScreen v-show="isReady" />
</template>

<style scoped lang='css'></style>