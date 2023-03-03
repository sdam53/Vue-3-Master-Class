<script setup lang="ts">
//this is the entry point file.
//the router view basically handles our paging. and since we defined "/" we get send to it automatically
import TheNavbar from "./components/TheNavbar.vue";
</script>

<template>
    <div class="container">
        <TheNavbar />
        <router-view />
    </div>
</template>

<style>
@import "@/assets/style.css";
</style>
