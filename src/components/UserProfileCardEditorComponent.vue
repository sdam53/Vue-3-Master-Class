<script setup lang="ts">
// @ts-nocheck
//TODO: alot of errors regarding custom yup messages and @submit event
//editor component to update user info

import LoadingScreen from "@/composables/UseLoadingScreen.vue";
import { convertImageURLToBlob } from "@/middleware/HelperFunctions";
import { editProfileSchema } from "@/plugins/Yup";
import router from "@/router";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import { useUsersStore } from "@/stores/UsersStore";
import type User from "@/types/User";
import { ErrorMessage as VeeErrorMessage, Field as VeeField, Form as VeeForm } from "vee-validate";
import type { PropType } from "vue";
import { ref } from "vue";
import { useToast } from "vue-toastification";
import AppAvatar from "./AppAvatar.vue";
import UserProfileCardEditorRandomAvatar from "./UserProfileCardEditorRandomAvatar.vue";

//toast
const Toast = useToast();

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
const locationsOptions = ref([]);

//store
const currentUserStore = useCurrentUserStore();
const usersStore = useUsersStore();

//vee validation and yup rule schema
const schema = editProfileSchema;

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
const handleRandomAvatar = (e: Event) => {
    activeUser.value.avatar = e as unknown as string;
};

/**
 * when user submits avatar update using Pixabay,
 * we need to download and store the image and update the url
 */
const handleRandomAvatarUpload = async () => {
    if (
        typeof activeUser?.value?.avatar === "string" &&
        activeUser?.value?.avatar?.startsWith("https://pixabay")
    ) {
        let imageBlob = await convertImageURLToBlob(activeUser.value.avatar);
        const fileName = activeUser.value.avatar.substring(
            activeUser.value.avatar.indexOf("get/") + 4
        );
        const imageType = fileName.substring(fileName.indexOf(".") + 1);
        var newFile = new File([imageBlob], fileName, { type: `image/${imageType}` });
        const avatar = await usersStore.uploadAvatar(currentUserStore.authId as string, newFile);
        if (avatar) {
            activeUser.value.avatar = avatar;
        }
    }
};

/**
 * gets all locations when user hovers over the location editor
 */
const loadLocationOptions = async () => {
    if (locationsOptions.value.length > 0) return;
    const res = await fetch("https://restcountries.com/v3.1/all");
    locationsOptions.value = await res.json();
};

/**
 * saves the edited information
 */
const save = async (e: {
    username: string;
    name: string;
    website: string | undefined;
    email: string;
}) => {
    try {
        activeUser.value.username = e.username;
        activeUser.value.name = e.name;
        activeUser.value.website = e.website;
        activeUser.value.email = e.email;
        await handleRandomAvatarUpload();
        currentUserStore.updateUser(activeUser.value);
        Toast.success("Successfully updated!");
        cancel();
    } catch (e) {
        Toast.error("Something went wrong...");
    }
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
        <VeeForm @submit="save" :validation-schema="schema">
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
                @sendImage="handleRandomAvatar"
            ></UserProfileCardEditorRandomAvatar>

            <div class="form-group">
                <label for="user_name">Username</label>
                <VeeField
                    v-model="activeUser.username"
                    type="text"
                    placeholder="Username"
                    class="form-input text-lead text-bold"
                    name="username"
                />
                <VeeErrorMessage name="username" class="form-error"></VeeErrorMessage>
            </div>

            <div class="form-group">
                <label for="user_username">Name</label>
                <VeeField
                    v-model="activeUser.name"
                    type="text"
                    placeholder="Full Name"
                    class="form-input text-lead"
                    name="name"
                />
                <VeeErrorMessage name="name" class="form-error"></VeeErrorMessage>
            </div>

            <div class="form-group">
                <label for="user_bio">Bio</label>
                <textarea
                    v-model="activeUser.bio"
                    class="form-input"
                    id="user_bio"
                    placeholder="Write a few words about yourself."
                    name="bio"
                ></textarea>
            </div>

            <hr />

            <div class="form-group">
                <label class="form-label" for="user_website">Website</label>
                <VeeField
                    v-model="activeUser.website"
                    autocomplete="off"
                    class="form-input"
                    id="user_website"
                    name="website"
                />
                <VeeErrorMessage name="website" class="form-error"></VeeErrorMessage>
            </div>

            <div class="form-group">
                <label class="form-label" for="user_email">Email</label>
                <VeeField
                    disabled
                    v-model="activeUser.email"
                    autocomplete="off"
                    class="form-input"
                    id="user_email"
                    name="email"
                />
                <VeeErrorMessage name="email" class="form-error"></VeeErrorMessage>
            </div>

            <div class="form-group">
                <label class="form-label" for="user_location">Location</label>
                <input
                    v-model="activeUser.location"
                    autocomplete="off"
                    class="form-input"
                    id="user_location"
                    list="locations"
                    @mouseenter="loadLocationOptions"
                />
            </div>
            <datalist id="locations">
                <option
                    v-for="location in locationsOptions"
                    :value="location.name.common"
                    :key="location.name.common"
                ></option>
            </datalist>

            <div class="btn-group space-between">
                <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
                <button type="submit" class="btn-blue">Save</button>
            </div>
        </VeeForm>
    </div>
</template>

<style scoped>
img {
    object-fit: cover;
}
</style>
