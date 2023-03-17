<script setup lang='ts'>
//page to register a user 

import UseLoadingScreen from "@/composables/UseLoadingScreen.vue";
import { useUsersStore } from "@/stores/UsersStore";
import type RegistrationForm from "@/types/RegisterForm";
import type User from "@/types/User";
import { useAsyncState } from "@vueuse/core";
import router from "@/router";
import { ref } from "vue";

//stores
const usersStore = useUsersStore()

//refs
const form = ref<RegistrationForm>({
    name: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
})

/**
 * function to register the user
 */
async function register() {
    //do a loading
    await usersStore.registerUserWithEmailPassword({
        name: form.value.name,
        username: form.value.username,
        email: form.value.email,
        avatar: form.value.avatar,
    } as User, form.value.password)
    router.push({ name: "Home" })
    isReady.value = false
}


const { isReady } = useAsyncState(async () => {
    //not much to do here but I think its nicer 
    //to be consistent with the other pages
}, undefined);
</script>

<template>
    <UseLoadingScreen v-show="!isReady" />
    <div class="flex-grid justify-center push-top">
        <div class="col-2">
            <form @submit.prevent="register" class="">
                <h1 class="text-center">Register</h1>

                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input v-model="form.name" id="name" type="text" class="form-input">
                </div>

                <div class="form-group">
                    <label for="username">Username</label>
                    <input v-model="form.username" id="username" type="text" class="form-input">
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input v-model="form.email" id="email" type="email" class="form-input">
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input v-model="form.password" id="password" type="password" class="form-input">
                </div>

                <div class="form-group">
                    <label for="avatar">Avatar (Optional)</label>
                    <input v-model="form.avatar" id="avatar" type="text" class="form-input">
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-blue btn-block">Register</button>
                </div>

            </form>
            <div class="text-center push-top">
                <button class="btn-red btn-xsmall"><i class="fa fa-google fa-btn"></i>Sign up with Google</button>
            </div>
        </div>
    </div>
</template>

<style scoped lang='css'></style>