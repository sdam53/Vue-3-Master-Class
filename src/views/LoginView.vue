<script setup lang='ts'>
import { ref } from "vue";
import UseLoadingScreen from "@/composables/UseLoadingScreen.vue";
import type LoginForm from "@/types/LoginForm";

const form = ref<LoginForm>({
    email: "",
    password: ""
})

const isReady = ref(false)

const login = () => {
    console.log("Login")
    isReady.value = !isReady.value
    setTimeout(() => isReady.value = !isReady.value
        , 500)
}

</script>

<template>
    <UseLoadingScreen v-show="isReady" />
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
                    <button class="btn-red btn-xsmall"><i class="fa fa-google fa-btn"></i>Sign in with Google</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang='css'></style>