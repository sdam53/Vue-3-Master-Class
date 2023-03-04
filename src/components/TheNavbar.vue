<script setup lang="ts">
import { ref } from "vue";
import { useCurrentUserStore } from "@/stores/CurrentUserStore.js";
const currentUser = useCurrentUserStore();

const appTitle = ref("FORUMS BOI");
const sidebar = ref(false);
//https://pictogrammers.com/library/mdi/
//places icon names icon: "mdi-{icon_name}
const menuItems = ref([
    {
        title: "Home",
        path: "/",
        icon: "mdi-home"
    },
    {
        title: "Category",
        path: "/",
        icon: "mdi-shape"
    },
    {
        title: "Forum",
        path: "/",
        icon: "mdi-forum"
    }
]);
</script>

<template>
    <v-app>
        <v-navigation-drawer v-model="sidebar" app>
            <v-list v-if="sidebar">
                <v-list-tile v-for="item in menuItems" :key="item.title" :to="item.path">
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>{{ item.title }}</v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>

        <v-toolbar app>
            <span class="hidden-sm-and-up">
                <v-toolbar-side-icon @click="sidebar = !sidebar"> </v-toolbar-side-icon>
            </span>
            <v-toolbar-title>
                <router-link to="/" tag="span" style="cursor: pointer">
                    {{ appTitle }}
                </router-link>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-xs-only">
                <v-btn flat v-for="item in menuItems" :key="item.title" :to="item.path">
                    <v-icon left dark>{{ item.icon }}</v-icon>
                    {{ item.title }}
                </v-btn>

                <v-btn v-if="currentUser.isSignedIn" flat :to="`/me`">
                    <v-img left dark src="currentUser.authUser?.avatar"></v-img>
                    {{ currentUser.authUser?.name }}
                </v-btn>

                <v-btn v-else flat :to="`/`">
                    <v-icon left dark>{{ "mdi-login" }}</v-icon>
                    Sign In
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>

        <v-content class="container">
            <router-view></router-view>
        </v-content>
    </v-app>
</template>

<style scoped></style>
