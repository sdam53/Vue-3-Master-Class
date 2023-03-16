<script setup lang="ts">
//home page to show categories and their forums

import CategoryListComponent from "@/components/CategoryListComponent.vue";
import { useCategoriesStore } from "@/stores/CategoriesStore";
import { useForumsStore } from "@/stores/ForumsStore";
import { useAsyncState } from "@vueuse/core";
import type Category from "@/types/Category";
import { computed, ref } from "vue";

//store
const categoriesStore = useCategoriesStore();
const forumsStore = useForumsStore();

//ref

//computed props
const categories = computed(() => categoriesStore.categories);

//
const { isReady } = useAsyncState(async () => {
    let categoriesStore = useCategoriesStore();
    let forumsStore = useForumsStore();
    const categories: Category[] = await categoriesStore.fetchAllCategories();
    const forumIds = categories.map((category) => category.forums).flat();
    await forumsStore.fetchForums(forumIds);
}, undefined);
</script>

<template>
    <div v-if="isReady" class="container">
        <h1 class="push-top">Welcome to the Forum</h1>
        <CategoryListComponent :categories="categories" />
    </div>
</template>
