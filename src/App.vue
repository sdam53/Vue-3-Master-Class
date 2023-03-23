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
const loadingScreen = ref<boolean>(true);

/**
 * turn on loading after each page change
 */
router.beforeEach(() => {
    notReady()
});

/**
 * when everything needed is loaded, each page will send an 'ready' event
 */
function ready() {
    if (progressBar.value) progressBar.value.finish();
    loadingScreen.value = false;
}

function notReady() {
    ready()
    progressBar.value = useProgress().start()
    loadingScreen.value = true;
}
</script>

<template>
    <vue3-progress-bar></vue3-progress-bar>
    <UseLoadingScreen v-show="loadingScreen" />
    <header>
        <TheNavbar />
    </header>
    <suspense>
        <div class="container" v-show="!loadingScreen">
            <router-view @ready="ready" @notReady="notReady" :key="$route.path"></router-view>
        </div>
    </suspense>
    <footer>
    </footer>
</template>

<style lang="scss">
@import "@/assets/style.css";

$vue3-progress-bar-color: #0db1c7 !important;
$vue3-progress-bar-height: 2px !default;

@import "./../node_modules/@marcoschulte/vue3-progress/dist/index.scss";
/* exposed variables
https://www.npmjs.com/package/@marcoschulte/vue3-progress?activeTab=readme
$vue3-progress-bar-container-z-index: 999999 !default;
$vue3-progress-bar-container-transition: all 500ms ease !default;
$vue3-progress-bar-color: #42b983 !default;
$vue3-progress-bar-height: 2px !default;
$vue3-progress-bar-transition: all 200ms ease !default;
*/
</style>