<script setup lang="ts">
//allows user to get a random image from Pixabay

import { getRandomItemInArray } from "@/middleware/HelperFunctions";
import { ref } from "vue";

//emits
const emits = defineEmits(["sendImage"]);

//ref
const searchTerms = ref([
    "cats",
    "dogs",
    "abstract",
    "cars",
    "mountains",
    "beach",
    "landscape",
    "object",
    "food",
    "flowers",
    "architecture",
    "yellow",
    "green",
    "blue",
    "orange",
    "black",
    "white",
    "brown",
    "red",
    "patterns",
    "animal",
    "code",
    "space"
]);

/**
 * makes a request to pixabay for images, then selects a random one from the response. send emit of image url
 */
const getRandomImage = async () => {
    const url = `https://pixabay.com/api/?key=${
        import.meta.env.VITE_APP_PIXABAY_API_KEY
    }&q=${getRandomItemInArray(searchTerms.value)}&orientation=vertical`;
    const res = await fetch(url);
    const data = await res.json();
    const randomImage = getRandomItemInArray(data.hits);
    emits("sendImage", randomImage.webformatURL);
};
</script>

<template>
    <div class="text-center" style="margin-bottom: 15px"></div>
    <button class="btn-green btn-small" @click.prevent="getRandomImage">Random Avatar</button>
    <br />
    <small style="opacity: 0.5">Powered by <a href="https://pixabay.com">Pixabay</a></small>
</template>

<style scoped lang="css"></style>
