<script setup lang="ts">
//home page to show categories and their forums

import CategoryListComponent from "@/components/CategoryListComponent.vue";
import { useCategoriesStore } from "@/stores/CategoriesStore";

//store
const categoriesStore = useCategoriesStore();

const categories = categoriesStore.categories;
</script>

<template>
    <h1 class="push-top">Welcome to the Forum</h1>
    <CategoryListComponent :categories="categories" />
</template>
