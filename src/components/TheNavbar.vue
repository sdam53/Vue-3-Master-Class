<script setup lang="ts">
//component for the navigation bar

import { useCurrentUserStore } from "@/stores/CurrentUserStore.js";
import { useUAStore } from "@/stores/UAStore";
import {
    mdiAccountCircle,
    mdiAccountPlusOutline,
    mdiForum,
    mdiHome,
    mdiLogin,
    mdiLogout,
    mdiMenuDown
} from "@mdi/js";
import { computed, ref } from "vue";

//store
const currentUser = useCurrentUserStore();
const UAStore = useUAStore();

//refs
const appTitle = ref("FORUMS BOI");
const drawer = ref(false);

//computed
const isMobile = computed(() => UAStore.isMobile);
const isDesktop = computed(() => UAStore.isDesktop);

//https://pictogrammers.com/library/mdi/
//places icon names icon: "mdi-{icon_name}
//refs
const menuItems = ref([
    {
        title: "Home",
        name: "Home",
        icon: mdiHome
    },
    /* //TODO: implement these pages
    {
        title: "Category",
        name: "ThreadsAll",
        icon: "mdi-shape"
    },
    
    {
        title: "Forums",
        name: "ForumsAll",
        icon: "mdi-forum"
    },
    */
    {
        title: "Threads",
        name: "ThreadsAll",
        icon: mdiForum
    }
]);
const signIn = ref({
    title: "Sign In",
    name: "Login",
    icon: mdiLogin
});
const register = ref({
    title: "Register",
    name: "Register",
    icon: mdiAccountPlusOutline
});
const signedInItems = ref([
    {
        title: "Profile",
        name: "Profile",
        icon: mdiAccountCircle
    },
    {
        title: "Sign Out",
        name: "Logout",
        icon: mdiLogout
    }
]);

const menuDownIcon = mdiMenuDown;

/**
 * closes the app drawer
 */
function closeDrawer() {
    drawer.value = false;
}
</script>

<template>
    <!--TODO:This may cause an issue later when we need to scroll through the app drawer itself-->
    <!--Using this to force the height of the content divs-->
    <!--The actual nav bar-->
    <!--Desktop layout--------------------------------------------------------------------------------------------------------->
    <v-app-bar v-if="isDesktop" theme="dark">
        <!--Title-->
        <v-app-bar-title>
            <router-link to="/" tag="span" style="cursor: pointer">
                {{ appTitle }}
            </router-link>
        </v-app-bar-title>
        <!--Nav bar items-->
        <v-btn flat v-for="item in menuItems" :key="item.title" :to="{ name: item.name }">
            <v-icon left dark :icon="item.icon"></v-icon>
            {{ item.title }}
        </v-btn>
        <!--User logged-in items-->
        <v-menu open-on-hover v-if="currentUser.isSignedIn">
            <!--User profile name-->
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
            <!--Drop down items-->
            <v-list>
                <v-list-item
                    v-for="(item, index) in signedInItems"
                    :key="index"
                    :to="{ name: item.name }"
                >
                    {{ item.title }}
                </v-list-item>
            </v-list>
        </v-menu>
        <!--User not signed in-->
        <v-btn v-else flat :to="{ name: signIn.name }" style="cursor: pointer">
            <v-icon left dark :icon="signIn.icon"></v-icon>
            {{ signIn.title }}
        </v-btn>
    </v-app-bar>
    <!--Mobile layout---------------------------------------------------------------------------------------------------------->
    <v-app-bar v-else theme="dark">
        <!--Title-->
        <v-app-bar-title>
            <router-link to="/" tag="span" style="cursor: pointer">
                {{ appTitle }}
            </router-link>
        </v-app-bar-title>
        <!--Hambuger will contain everything when mobile-->
        <!--the button icon to get the drawer-->
        <template v-slot:append class="hidden-xs-only">
            <v-app-bar-nav-icon @click="() => (drawer = !drawer)"></v-app-bar-nav-icon>
        </template>
    </v-app-bar>
    <!--Items in the nav drawer-->
    <v-navigation-drawer v-model="drawer" height="100px" location="right" :temporary="true">
        <!--signed in-->
        <v-list v-if="currentUser.isSignedIn">
            <v-list-item
                :prepend-avatar="currentUser.avatar as string"
                :title="currentUser.name + ', (' + currentUser.username + ')'"
                :subtitle="currentUser.email"
                :to="{ name: 'Profile' }"
            >
                <template v-slot:append>
                    <v-btn size="small" variant="text" :icon="menuDownIcon"></v-btn>
                </template>
            </v-list-item>
        </v-list>
        <!--Not signed in-->
        <v-list-item v-else>
            <v-list-item
                :title="signIn.title"
                :to="{ name: signIn.name }"
                :prepend-icon="signIn.icon"
            >
            </v-list-item>
            <v-list-item
                :title="register.title"
                :to="{ name: register.name }"
                :prepend-icon="register.icon"
            >
            </v-list-item>
        </v-list-item>
        <v-divider></v-divider>
        <!--Nav items-->
        <v-list-item>
            <v-list-item
                v-for="item in menuItems"
                :key="item.title"
                :title="item.title"
                :to="{ name: item.name }"
                :prepend-icon="item.icon"
            >
            </v-list-item>
        </v-list-item>
        <!--logged in items-->
        <!--TODO:I want to have these inside the profile button drop down-->
        <v-list-item v-if="currentUser.isSignedIn">
            <v-divider></v-divider>
            <v-list-item
                v-for="item in signedInItems"
                :key="item.title"
                :title="item.title"
                :to="{ name: item.name }"
                :prepend-icon="item.icon"
            >
            </v-list-item>
        </v-list-item>
    </v-navigation-drawer>

    <!-- OLD WAY KEPT IN CASE
            <v-toolbar>
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
--></template>

<style lang="scss">
$navigation-drawer-height: 50% !default;
</style>
