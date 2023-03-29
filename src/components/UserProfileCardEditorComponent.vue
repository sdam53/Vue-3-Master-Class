<script setup lang="ts">
//editor component to update user info

import router from "@/router";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import { useUsersStore } from "@/stores/UsersStore";
import type User from "@/types/User";
import type { PropType } from "vue";
import { ref } from "vue";

//prop
//const props = defineProps(["user"]);
const props = defineProps({
    user: {
        type: Object as PropType<User>,
        required: true
    }
});

//ref
const activeUser = ref<User>({ ...props.user } as User);

//store
const currentUserStore = useCurrentUserStore();
const usersStore = useUsersStore();

const handleAvatarUpload = async (e: Event) => {
    const file = e?.target?.files[0];
    activeUser.value.avatar = file;
    activeUser.value = await usersStore.uploadAvatar(
        currentUserStore.authId as string,
        activeUser.value
    );
};

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
                <label for="avatar">
                    <img
                        :src="activeUser.avatar as undefined | string"
                        :alt="`${user.name} profile picture`"
                        class="avatar-xlarge img-update"
                    />
                    <input
                        v-show="false"
                        type="file"
                        id="avatar"
                        accept="image/*"
                        @change="handleAvatarUpload"
                    />
                </label>
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
