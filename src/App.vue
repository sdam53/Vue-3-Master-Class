<script setup lang="ts">
//this is the entry point file.
//the router view basically handles our paging. and since we defined "/" we get send to it automatically
import TheNavbar from "./components/TheNavbar.vue";
import TheFooter from "./components/TheFooter.vue";
import { useCurrentUserStore } from "./stores/CurrentUserStore";
import { useProgress } from "@marcoschulte/vue3-progress";
import UseLoadingScreen from "@/composables/UseLoadingScreen.vue";
import router from "./router";
import { ref } from "vue"

const currentUser = useCurrentUserStore();
currentUser.fetchAuthUser();

const progressBar = ref<any>(null);
const loadingScreen = ref<boolean>(false);

/**
 * turn on loading after each page change
 */
router.beforeEach(() => {
    progressBar.value = useProgress().start()
    loadingScreen.value = false;
});

/**
 * when everything needed is loaded, each page will send an 'ready' event
 */
function ready() {
    if (progressBar.value) progressBar.value.finish();
    loadingScreen.value = true;
}
</script>

<template>
    <vue3-progress-bar></vue3-progress-bar>
    <UseLoadingScreen v-show="!loadingScreen" />
    <header>
        <TheNavbar />
    </header>
    <suspense>
        <div class="container">
            <router-view @ready="ready"></router-view>
        </div>
    </suspense>
    <footer>
    </footer>
</template>

<style>
@import "@/assets/style.css";
@import "@marcoschulte/vue3-progress/dist/index.css";
</style>