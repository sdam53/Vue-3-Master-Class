<script setup lang="ts">
import UserProfileCard from "@/components/UserProfileCardComponent.vue";
import { useUsersStore } from "@/stores/UsersStore";
import type User from "@/types/User";
import { useAsyncState } from "@vueuse/core";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

//route
const router = useRouter();
const route = useRoute();

//stores
const usersStore = useUsersStore();

//emits
const emits = defineEmits(["ready"]);

//props
const props = defineProps({
    id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: false
    }
});

//computed
const user = computed<User>(() => (usersStore.getUser(props.id) as User) || null);

const { isReady } = useAsyncState(async () => {
    await usersStore.fetchUser(props.id);
    isOnValidPage();
    document.title = `${user.value?.username}'s Profile`;
    emits("ready");
}, undefined);

/**
 * redirects if invalid user or username/no username in url
 */
const isOnValidPage = () => {
    console.log(route.params.username);
    if (!user.value) {
        router.push({ name: "NotFound" });
    }
    if (!route.params.username || route.params.username !== user.value.username) {
        router.push({
            name: "ProfileUsers",
            params: { id: props.id, username: user.value.username }
        });
    }
};
</script>

<template>
    <div class="container" style="width: 100%">
        <div class="flex-grid">
            <!--Profile card and editor-->
            <div class="col-3 push-top">
                <UserProfileCard :id="props.id" />
            </div>
            <!--Shows user posts-->
            <div class="col-7 push-top">
                <div class="profile-header">
                    <span class="text-lead"> {{ user?.username }}'s recent activity </span>
                    <a href="#">See only started threads?</a>
                </div>
                <hr />
                <!--Infinite loading of posts-->
            </div>
        </div>
    </div>
</template>
