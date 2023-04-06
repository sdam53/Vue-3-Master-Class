<script setup lang="ts">
//Login page
//i ignore validation due to it making the css act up

import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import type LoginForm from "@/types/LoginForm";
import { useAsyncState } from "@vueuse/core";
import { Field as VeeField, Form as VeeForm } from "vee-validate";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
//toast
const Toast = useToast();

//store
const currentUserStore = useCurrentUserStore();

//emits
const emits = defineEmits(["ready", "notReady"]);

//ref
const form = ref<LoginForm>({
    email: "",
    password: ""
});

const loginSchema = {
    email: {
        //label: "Your Name",
        name: "email",
        as: "input"
    },
    password: {
        //label: "Your Name",
        name: "password",
        as: "input",
        type: "password"
    }
};

//router stuff
const route = useRoute();
const router = useRouter();

/**
 * logins in the user and sends them to the home page
 * else error message will show
 */
async function login() {
    emits("notReady");
    try {
        await currentUserStore.signInWithEmailAndPass(form.value.email, form.value.password);
        successRedirect();
    } catch (error) {
        Toast.error("Invalid email or password");
        emits("ready");
    }
}

/**
 * functon that logs in with google pop up
 */
async function loginWithGoogle() {
    await currentUserStore.signInWithGoogle();
    successRedirect();
}

/**
 * redirects the user to the previous page or home depending on sign in path
 * route and router needs to be defined in setup
 */
async function successRedirect() {
    //await router.isReady();
    const redirectTo = route.query.redirectTo || { name: "Home" };
    router.push(redirectTo as string);
}

const { isReady } = useAsyncState(async () => {
    document.title = "Sign In";
    emits("ready");
}, undefined);
</script>

<template>
    <div class="container">
        <div class="flex-grid justify-center">
            <div class="col-1">
                <VeeForm @submit="login" class="card card-form">
                    <h1 class="text-center">Sign In</h1>
                    <!--Email field-->
                    <div class="form-group">
                        <label for="email">Email </label>
                        <VeeField
                            v-model="form.email"
                            id="email"
                            type="text"
                            class="form-input"
                            :name="loginSchema.email.name"
                        />
                    </div>
                    <!--Password field-->
                    <div class="form-group">
                        <label for="password">Password</label>
                        <VeeField
                            v-model="form.password"
                            id="password"
                            :type="loginSchema.password.type"
                            class="form-input"
                            :name="loginSchema.password.name"
                        />
                    </div>
                    <div class="push-top">
                        <button type="submit" class="btn-blue btn-block">Sign in</button>
                    </div>
                    <div class="form-actions text-right">
                        <router-link :to="{ name: 'Register' }">Create an account?</router-link>
                    </div>
                </VeeForm>
                <div class="push-top text-center">
                    <button @click.prevent="loginWithGoogle" class="btn-red btn-xsmall">
                        <i class="fa fa-google fa-btn"></i>Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="css"></style>
