<script setup lang="ts">
import type User from "@/types/User";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
const currentUserStore = useCurrentUserStore();

const props = defineProps<{
    user: { type: User; required: true };
}>();
</script>

<template>
    <div class="profile-card">
        <p class="text-center">
            <img
                :src="currentUserStore.avatar"
                :alt="`${currentUserStore.name} profile picture`"
                class="avatar-xlarge"
            />
        </p>

        <h1 class="title">{{ currentUserStore.username }}</h1>

        <p class="text-lead">{{ currentUserStore.name }}</p>

        <p class="text-justify">{{ currentUserStore.bio || "No bio specified." }}</p>

        <span class="online">{{ currentUserStore.username }} is online</span>

        <div class="stats">
            <span>{{ currentUserStore.postsCount }} posts</span>
            <span>{{ currentUserStore.threadsCount }} threads</span>
        </div>

        <hr />

        <p v-if="currentUserStore.website" class="text-large text-center">
            <i class="fa fa-globe"></i>
            <a :href="currentUserStore.website">{{ currentUserStore.website }}</a>
        </p>
    </div>
</template>
