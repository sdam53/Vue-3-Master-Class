<script setup lang="ts">
//profile card component for user info

import { useUsersStore } from "@/stores/UsersStore";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import AppAvatar from "./AppAvatar.vue";

//router
const route = useRoute();

//store
const usersStore = useUsersStore();

//props
const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

//ref
const userId = ref(props.id);

//computed
const user = computed(() => usersStore.getUser(userId.value));
</script>

<template>
    <div v-if="user" class="profile-card">
        <p class="text-center">
            <AppAvatar
                :src="user?.avatar as string"
                :alt="user?.name + '\'s profile picture'"
                class="avatar-xlarge"
            >
            </AppAvatar>
        </p>

        <h1 class="title">{{ user?.username }}</h1>

        <p class="text-lead">{{ user?.name }}</p>

        <p class="text-justify">{{ user?.bio || "No bio specified." }}</p>

        <span class="online">{{ user?.username }} is online</span>

        <div class="stats">
            <span>{{ user?.postsCount || 0 }} posts</span>
            <span>{{ user?.threadsCount || 0 }} threads</span>
        </div>

        <hr />

        <p v-if="user?.website" class="text-large text-center">
            <i class="fa fa-globe"></i>
            <a :href="user?.website">{{ user?.website }}</a>
        </p>

        <p class="text-xsmall text-faded text-center">
            Member since june 2003, last visited 4 hours ago
        </p>

        <div class="text-center" v-if="route.name === 'Profile'">
            <hr />
            <router-link :to="{ name: 'ProfileEdit' }" class="btn-green btn-small"
                >Edit Profile</router-link
            >
        </div>
    </div>
</template>
