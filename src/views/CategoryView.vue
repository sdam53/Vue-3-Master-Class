<script setup lang="ts">
//page to show different categories of forums.
//navigate by clicking on a category
import { computed, defineProps } from "vue";
import ForumListComponent from "@/components/ForumListComponent.vue";
import { useCategoriesStore } from "@/stores/CategoriesStore.js";
import { useForumsStore } from "@/stores/ForumsStore.js";
import type Category from "@/types/Category";

const categoriesStore = useCategoriesStore();
const ForumsStore = useForumsStore();

const props = defineProps(["id", "slug"]);

const category = computed(() => {
    return categoriesStore.categories.find((category) => category.id === props.id);
});
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
