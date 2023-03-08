<script setup lang="ts">
//page to show different categories of forums.
//navigate by clicking on a category
//TODO: ATM slug doesnt display
//we get sent here by the ForumListComponent
import { computed, defineProps } from "vue";
import ForumListComponent from "@/components/ForumListComponent.vue";
import { useCategoriesStore } from "@/stores/CategoriesStore.js";
import { useForumsStore } from "@/stores/ForumsStore.js";
import type Category from "@/types/Category";
import { findById } from "@/middleware/HelperFunctions";

//stores
const categoriesStore = useCategoriesStore();
const ForumsStore = useForumsStore();

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
    return ForumsStore.forums.filter((forum) => forum.categoryId === category.id);
};
</script>

<template>
    <div class="col-full push-top">
        <h1>{{ category?.name }}</h1>
        <ForumListComponent :forums="getForumsForCategory(category!)" :title="'Forums'" />
    </div>
</template>
