<script setup lang="ts">
//page to register a user

import { Yup } from "@/plugins/Yup";
import router from "@/router";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import { useUsersStore } from "@/stores/UsersStore";
import type User from "@/types/User";
import { useAsyncState } from "@vueuse/core";
import { ErrorMessage as VeeErrorMessage, Field as VeeField, Form as VeeForm } from "vee-validate";
import { ref } from "vue";
import { useToast } from "vue-toastification";

//stores
const usersStore = useUsersStore();
const currentUserStore = useCurrentUserStore();

//toast
const Toast = useToast();

//emits
const emits = defineEmits(["ready", "notReady"]);

//refs
const avatar = ref(null);
const avatarPreview = ref();
const fileInputKey = ref(0); //this is a key to force file input to reset

//vee validate and yup rule schema
const schema = Yup.object({
    name: Yup.string().min(1, "You need a name!").required("This is required!"),
    username: Yup.string()
        .min(1, "You need a username!")
        .uniqueUsername("This username is already taken!")
        .required("This is required!"),
    email: Yup.string()
        .email("This isnt a valid email!")
        .uniqueEmail("This email is already registered!")
        .required("This is required!"),
    password: Yup.string()
        .min(5, "This needs to be at least 5 characters long!")
        .hasDigits("Password needs at least 1 digit!")
        .hasUppercase("Password needs at least 1 uppercase letter!")
        .hasSymbols("Password needs at least 1 special symbol!")
        .required("This is required!"),
    verifyPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match!")
        .required("This is required!")
        .label("Password confirmation")
});

/**
 * function to register the user
 */
async function register(values: {
    name: string;
    username: string;
    email: string;
    password: string;
    passwordVerify: string;
}) {
    //do a loading
    emits("notReady");
    try {
        await usersStore.registerUserWithEmailPassword(
            {
                name: values.name,
                username: values.username,
                email: values.email,
                avatar: avatar.value
            } as User,
            values.password
        );
        router.push({ name: "Home" });
    } catch (error) {
        if ((error as string).toString().includes("auth/email-already-in-use"))
            Toast.error("That email is already taken...", { timeout: 2000 });
        else Toast.error("Something went wrong... " + error, { timeout: 2000 });
        emits("ready");
    }
}

/**
 * function to register with google
 */
async function registerWithGoogle() {
    await currentUserStore.signInWithGoogle();
    router.push({ name: "Home" });
}

/**
 * handles when profile pic file gets changed
 * @param e event
 */
const handleImageUpload = (e: Event) => {
    try {
        avatar.value = e?.target?.files[0];
        const reader = new FileReader();
        reader.onload = (event) => (avatarPreview.value = event?.target?.result);
        reader.readAsDataURL(avatar.value as unknown as Blob);
    } catch (error) {
        handleInvalidImageUpload();
    }
};

/**
 * gets called when use has send invalid file as profile image
 * @param e event
 */
const handleInvalidImageUpload = (e: Event | null = null) => {
    Toast.error("Invalid File");
    avatar.value = null;
    avatarPreview.value = null;
    fileInputKey.value++;
};

const { isReady } = useAsyncState(async () => {
    document.title = "Register";
    emits("ready");
}, undefined);
</script>

<template>
    <div class="flex-grid justify-center push-top">
        <div class="col-2">
            <VeeForm @submit="register" class="card card-form" :validation-schema="schema">
                <h1 class="text-center">Register</h1>

                <div class="form-group">
                    <label for="name">Full Name</label>
                    <VeeField type="text" class="form-input" name="name" />
                    <VeeErrorMessage name="name" class="form-error"></VeeErrorMessage>
                </div>

                <div class="form-group">
                    <label for="username">Username</label>
                    <VeeField type="text" class="form-input" name="username" />
                    <VeeErrorMessage name="username" class="form-error"></VeeErrorMessage>
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <VeeField type="email" class="form-input" name="email" />
                    <VeeErrorMessage name="email" class="form-error"></VeeErrorMessage>
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <VeeField type="password" class="form-input" name="password" />
                    <VeeErrorMessage name="password" class="form-error"></VeeErrorMessage>
                </div>

                <div class="form-group">
                    <label for="password">Verify Password</label>
                    <VeeField type="password" class="form-input" name="verifyPassword" />
                    <VeeErrorMessage name="verifyPassword" class="form-error"></VeeErrorMessage>
                </div>

                <div class="form-group">
                    <label for="avatar">
                        Avatar (Optional)
                        <div v-if="avatarPreview">
                            <img
                                :src="avatarPreview"
                                class="avatar-xlarge"
                                @error="handleInvalidImageUpload"
                            />
                        </div>
                    </label>
                    <input
                        v-show="!avatarPreview"
                        id="avatar"
                        type="file"
                        class="form-input"
                        @change="handleImageUpload"
                        accept="image/*"
                        :key="fileInputKey"
                    />
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-blue btn-block">Register</button>
                </div>
            </VeeForm>
            <div class="text-center push-top">
                <button @click.prevent="registerWithGoogle" class="btn-red btn-xsmall">
                    <i class="fa fa-google fa-btn"></i>Sign up with Google
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="css"></style>
