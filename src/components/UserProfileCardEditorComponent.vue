<script setup lang="ts">
//editor component to update user info

import { ref } from "vue";
import type { PropType } from "vue";
import router from "@/router";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import type User from "@/types/User";

//prop
//const props = defineProps(["user"]);
const props = defineProps({
    user: {
        type: Object as PropType<User>,
        required: true
    }
});

//ref
const activeUser = ref({ ...props.user });

//store
const currentUserStore = useCurrentUserStore();

/**
 * saves the edited information
 */
const save = () => {
    currentUserStore.updateUser(activeUser.value);
    cancel();
};

/**
 * cancels the edited information
 */
const cancel = () => {
    router.push({ name: "Profile" });
};
</script>

<template>
    <div class="profile-card">
        <form @submit.prevent="save">
            <p class="text-center">
                <img
                    :src="activeUser.avatar"
                    :alt="`${user.name} profile picture`"
                    class="avatar-xlarge img-update"
                />
            </p>

            <div class="form-group">
                <input
                    v-model="activeUser.username"
                    type="text"
                    placeholder="Username"
                    class="form-input text-lead text-bold"
                />
            </div>

            <div class="form-group">
                <input
                    v-model="activeUser.name"
                    type="text"
                    placeholder="Full Name"
                    class="form-input text-lead"
                />
            </div>

            <div class="form-group">
                <label for="user_bio">Bio</label>
                <textarea
                    v-model="activeUser.bio"
                    class="form-input"
                    id="user_bio"
                    placeholder="Write a few words about yourself."
                ></textarea>
            </div>

            <hr />

            <div class="form-group">
                <label class="form-label" for="user_website">Website</label>
                <input
                    v-model="activeUser.website"
                    autocomplete="off"
                    class="form-input"
                    id="user_website"
                />
            </div>

            <div class="form-group">
                <label class="form-label" for="user_email">Email</label>
                <input
                    v-model="activeUser.email"
                    autocomplete="off"
                    class="form-input"
                    id="user_email"
                />
            </div>

            <div class="form-group">
                <label class="form-label" for="user_location">Location</label>
                <input
                    v-model="activeUser.location"
                    autocomplete="off"
                    class="form-input"
                    id="user_location"
                />
            </div>

            <div class="btn-group space-between">
                <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
                <button type="submit" class="btn-blue">Save</button>
            </div>
        </form>
    </div>
</template>
