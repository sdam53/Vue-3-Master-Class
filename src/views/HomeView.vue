<script setup lang="ts">
//home page to show categories and their forums

import CategoryListComponent from "@/components/CategoryListComponent.vue";
import { useCategoriesStore } from "@/stores/CategoriesStore";
import { useForumsStore } from "@/stores/ForumsStore";
import type Category from "@/types/Category";
import { computed } from "vue";

//store
const categoriesStore = useCategoriesStore();
const forumsStore = useForumsStore();

const categories = computed(() => categoriesStore.categories);

//gets all categories and forums
async function created() {
    const categories: Category[] = await categoriesStore.fetchAllCategories();
    const forumIds = categories.map((category) => category.forums).flat();
    forumsStore.fetchForums(forumIds);
}
await created();
</script>

<template>
    <h1 class="push-top">Welcome to the Forum</h1>
    <CategoryListComponent :categories="categories" />
</template>
