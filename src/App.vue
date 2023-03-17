<script setup lang="ts">
//this is the entry point file.
//the router view basically handles our paging. and since we defined "/" we get send to it automatically
import TheNavbar from "./components/TheNavbar.vue";
import TheFooter from "./components/TheFooter.vue";
import { useCurrentUserStore } from "./stores/CurrentUserStore";

const currentUser = useCurrentUserStore();
currentUser.fetchAuthUser();

</script>

<template>
    <header>
        <TheNavbar />
    </header>
    <suspense>
        <div class="container">
            <router-view></router-view>
        </div>
    </suspense>

    <footer>
        <TheFooter />
    </footer>
</template>

<style>
@import "@/assets/style.css";
</style>