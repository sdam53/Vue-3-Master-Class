<script setup lang="ts">
//component that is the footer

import { ref } from "vue";

//refs
const links = ref(["Home", "About Us", "Team", "Services", "Blog", "Contact Us"]);
</script>

<template>
    <!--TODO: v-app is making it long af for some reason-->
    <footer>
        <v-app>
            <v-footer color="blue" height="auto">
                <v-row justify="center" no-gutters>
                    <v-btn
                        v-for="link in links"
                        :key="link"
                        color="black"
                        variant="text"
                        class="mx-2"
                        rounded="xl"
                    >
                        {{ link }}
                    </v-btn>
                    <v-col class="text-center mt-4" cols="12">
                        {{ new Date().getFullYear() }} — <strong>Forums</strong>
                    </v-col>
                </v-row>
            </v-footer>
        </v-app>
    </footer>
</template>

<style scoped></style>
