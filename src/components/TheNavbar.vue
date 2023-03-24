<script setup lang="ts">
//component for the navigation bar

import { ref } from "vue";
import { useCurrentUserStore } from "@/stores/CurrentUserStore.js";

//store
const currentUser = useCurrentUserStore();

//refs
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

const signedInItems = ref([
    {
        title: "Profile",
        path: "/me"
        //icon: "mdi-forum"
    },
    {
        title: "Sign Out",
        path: "/logout"
        //icon: "mdi-forum"
    }
]);
</script>

<template>
    <div>
        <v-toolbar>
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

                <v-menu open-on-hover v-if="currentUser.isSignedIn">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            :to="{ name: 'Profile' }"
                            style="cursor: pointer"
                            color="primary"
                            v-bind="props"
                        >
                            {{ currentUser.authUser?.name }}
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item v-for="(item, index) in signedInItems" :key="index">
                            <v-btn flat :to="item.path">{{ item.title }}</v-btn>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <v-btn v-else flat :to="{ name: 'Login' }" style="cursor: pointer">
                    <v-icon left dark>{{ "mdi-login" }}</v-icon>
                    Sign In
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
    </div>
</template>

<style></style>
