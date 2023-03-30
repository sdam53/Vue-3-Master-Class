<script setup lang="ts">
//editor component to update user info

import LoadingScreen from "@/composables/UseLoadingScreen.vue";
import router from "@/router";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import { useUsersStore } from "@/stores/UsersStore";
import type User from "@/types/User";
import type { PropType } from "vue";
import { ref } from "vue";
import AppAvatar from "./AppAvatar.vue";
import UserProfileCardEditorRandomAvatar from "./UserProfileCardEditorRandomAvatar.vue";

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
const uploadingImage = ref(false);

//store
const currentUserStore = useCurrentUserStore();
const usersStore = useUsersStore();

/**
 * uploads the new profile image
 * @param e Event obj for change event
 */
const handleAvatarUpload = async (e: any) => {
    uploadingImage.value = true;
    const file = e?.target?.files[0];
    const avatar = await usersStore.uploadAvatar(currentUserStore.authId as string, file);
    //this handles when user uploads an invalid file
    //might be a better way to handle it
    if (avatar) activeUser.value.avatar = avatar;
    uploadingImage.value = false;
};

/**
 * sets the image after the user clicks for a random image
 * @param e event payload item but is pretty much a string
 */
const handleRandomImage = (e: Event) => {
    activeUser.value.avatar = e as unknown as string;
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
        <LoadingScreen v-if="uploadingImage"></LoadingScreen>
        <form @submit.prevent="save">
            <p class="text-center avatar-edit">
                <label for="avatar">
                    <AppAvatar
                        :src="activeUser.avatar as string"
                        :alt="`${user.name}'s profile picture`"
                        class="avatar-xlarge img-update"
                    />
                    <div class="avatar-upload-overlay">
                        <fa icon="camera" size="3x" :style="{ color: 'white', opacity: '8' }" />
                    </div>
                    <input
                        v-show="false"
                        type="file"
                        id="avatar"
                        accept="image/*"
                        @change="handleAvatarUpload"
                    />
                </label>
            </p>
            <UserProfileCardEditorRandomAvatar
                @sendImage="handleRandomImage"
            ></UserProfileCardEditorRandomAvatar>

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

<style scoped>
img {
    object-fit: cover;
}
</style>
