<script setup lang="ts">
//page not found redirect

const emits = defineEmits(["ready"]);

document.title = "404 Not Found";
emits("ready");
</script>

<template>
    <div class="col-full text-center">
        <h1>Not Found</h1>
        <router-link :to="{ name: 'Home' }">Read some cool threads</router-link>
    </div>
</template>

<style scoped></style>
