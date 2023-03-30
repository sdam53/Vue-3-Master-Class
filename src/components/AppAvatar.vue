<script setup lang="ts">
const props = defineProps({
    src: {
        type: String,
        required: true
    }
});
</script>

<template>
    <img :src="props.src" />
</template>

<style scoped>
img {
    object-fit: cover;
}
</style>
