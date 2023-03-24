<script setup lang="ts">
//loading screen composable

import { ref } from "vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

const isLoading = ref(false);
const fullPage = ref(false);

isLoading.value = true;
fullPage.value = true;
</script>

<template>
    <div class="vl-parent">
        <loading v-model:active="isLoading" :is-full-page="fullPage" />
    </div>
</template>
