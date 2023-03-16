<script setup lang="ts">
//page to show different categories of forums.
//navigate by clicking on a category
//TODO: ATM slug doesnt display
//we get sent here by the ForumListComponent
import { computed, defineProps } from "vue";
import ForumListComponent from "@/components/ForumListComponent.vue";
import UseLoadingScreen from "@/composables/UseLoadingScreen.vue";
import { useCategoriesStore } from "@/stores/CategoriesStore.js";
import { useForumsStore } from "@/stores/ForumsStore.js";
import type Category from "@/types/Category";
import { findById } from "@/middleware/HelperFunctions";
import { useAsyncState } from "@vueuse/core";

//stores
const categoriesStore = useCategoriesStore();
const forumsStore = useForumsStore();

//props
const props = defineProps({
    id: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    }
});

//computed data
const category = computed(() => {
    return findById(categoriesStore.categories, props.id);
});

//function to get forums for a certain category
const getForumsForCategory = (category: Category) => {
    return forumsStore.forums.filter((forum) => forum.categoryId === category.id);
};

//
const { isReady } = useAsyncState(async () => {
    if (category.value === undefined) {
        let category = await categoriesStore.fetchCategory(props.id);
        await forumsStore.fetchForums(category.forums);
    }
}, undefined);
</script>

<template>
    <UseLoadingScreen v-show="!isReady" />
    <div v-if="isReady" class="container push-top">
        <h1>{{ category?.name }}</h1>
        <ForumListComponent :forums="getForumsForCategory(category!)" :title="'Forums'" />
    </div>
</template>
