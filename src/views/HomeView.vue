<script setup lang="ts">
//home page to show categories and their forums

import CategoryListComponent from "@/components/CategoryListComponent.vue";
import { useCategoriesStore } from "@/stores/CategoriesStore";
import { useForumsStore } from "@/stores/ForumsStore";
import type Category from "@/types/Category";
import { useAsyncState } from "@vueuse/core";
import { computed } from "vue";
//store
const categoriesStore = useCategoriesStore();
const forumsStore = useForumsStore();

//ref

//emits
const emits = defineEmits(["ready"]);

//computed props
const categories = computed<Category[]>(() => categoriesStore.categories);

const { isReady } = useAsyncState(async () => {
    const categories: Category[] = await categoriesStore.fetchAllCategories();
    const forumIds = categories.map((category) => category.forums).flat();
    await forumsStore.fetchForums(forumIds);
    document.title = "Home";
    emits("ready");
}, undefined);
</script>

<template>
    <div v-if="isReady" class="container">
        <h1 class="push-top">Welcome to the Forum</h1>
        <CategoryListComponent :categories="categories" />
    </div>
</template>
