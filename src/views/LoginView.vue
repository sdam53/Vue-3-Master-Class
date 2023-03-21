<script setup lang='ts'>
import { ref } from "vue";
import UseLoadingScreen from "@/composables/UseLoadingScreen.vue";
import type LoginForm from "@/types/LoginForm";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import router from "@/router";

//store
const currentUserStore = useCurrentUserStore()

//emits
const emits = defineEmits(["ready"])

//ref
const form = ref<LoginForm>({
    email: "",
    password: ""
})
const isReady = ref<Boolean>(false)

if (currentUserStore.isSignedIn) {
    router.push({ name: "Home" })
}

/**
 * logins in the user and sends them to the home page
 * else error message will show
 */
async function login() {
    try {
        isReady.value = false;
        await currentUserStore.signInWithEmailAndPass(form.value.email, form.value.password)
        router.push({ name: "Home" })
    } catch (error) {
        alert((error as Error).message);
    }
    //isReady.value = true;
}

async function loginWithGoogle() {
    await currentUserStore.signInWithGoogle();
    router.push({ name: "Home" });
}

setTimeout(() => {
    isReady.value = true
}, 1000)

document.title = "Login"
emits("ready")
</script>

<template>
    <div class="container">
        <div class="flex-grid justify-center">
            <div class="col-1">
                <form @submit.prevent="login" class="card card-form">
                    <h1 class="text-center">Login</h1>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input v-model="form.email" id="email" type="text" class="form-input">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input v-model="form.password" id="password" type="password" class="form-input">
                    </div>

                    <div class="push-top">
                        <button type="submit" class="btn-blue btn-block">Log in</button>
                    </div>

                    <div class="form-actions text-right">
                        <router-link :to="{ name: 'Register' }">Create an account?</router-link>
                    </div>
                </form>

                <div class="push-top text-center">
                    <button @click.prevent="loginWithGoogle" class="btn-red btn-xsmall"><i
                            class="fa fa-google fa-btn"></i>Sign in with Google</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang='css'></style>