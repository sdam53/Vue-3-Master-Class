<script setup lang="ts">
//this is the entry point file.
//the router view basically handles our paging. and since we defined "/" we get send to it automatically
import UseLoadingScreen from "@/composables/UseLoadingScreen.vue";
import { useProgress } from "@marcoschulte/vue3-progress";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import TheFooter from "./components/TheFooter.vue";
import TheNavbar from "./components/TheNavbar.vue";
import { useCurrentUserStore } from "./stores/CurrentUserStore";
//fetchs the current auth user if there is one
const currentUser = useCurrentUserStore();
currentUser.fetchAuthUser();

//router stuff
const route = useRoute();
const router = useRouter();

//refs to keep track of where to have loading screen and progress bar
const progressBar = ref<any>(null);
const loadingScreen = ref<boolean>(true);

/**
 * turn on loading after each page change
 */
router.beforeEach(() => {
    notReady();
});

/**
 * when everything needed is loaded, each page will send an 'ready' event
 * tell us to turn off loading animations
 */
function ready() {
    if (progressBar.value) progressBar.value.finish();
    loadingScreen.value = false;
}

/**
 * resets the loading
 */
function notReady() {
    ready();
    progressBar.value = useProgress().start();
    loadingScreen.value = true;
}
</script>

<template>
    <v-app>
        <!--the navigation bar-->
        <TheNavbar> </TheNavbar>
        <!--Loading annimations-->
        <vue3-progress-bar></vue3-progress-bar>
        <UseLoadingScreen v-show="loadingScreen" />
        <!--the actual page contents which is handled by the router-->
        <!--3/24/23 suspense is an experiental feature but is needed for async-->
        <!--:key is used to force router to update and trigger lifecycle hooks-->
        <suspense>
            <v-container class="container" v-show="!loadingScreen" style="padding-top: 70px">
                <router-view
                    @ready="ready"
                    @notReady="notReady"
                    :key="route.fullPath"
                ></router-view>
            </v-container>
        </suspense>
        <!--Footer-->
        <TheFooter> </TheFooter>
    </v-app>
</template>

<style lang="scss">
@import "@/assets/style.css";

$vue3-progress-bar-color: #0db1c7 !important;
$vue3-progress-bar-height: 2px !default;

@import "./../node_modules/@marcoschulte/vue3-progress/dist/index.scss";
/* exposed progress bar variables
https://www.npmjs.com/package/@marcoschulte/vue3-progress?activeTab=readme
$vue3-progress-bar-container-z-index: 999999 !default;
$vue3-progress-bar-container-transition: all 500ms ease !default;
$vue3-progress-bar-color: #42b983 !default;
$vue3-progress-bar-height: 2px !default;
$vue3-progress-bar-transition: all 200ms ease !default;
*/
</style>
