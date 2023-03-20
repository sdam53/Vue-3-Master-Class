<script setup lang="ts">
//component to display a list of categories and their respective forums

import ForumList from "@/components/ForumListComponent.vue";
import { useForumsStore } from "@/stores/ForumsStore";
import type Category from "@/types/Category";
import type { PropType } from "vue";

//props
const props = defineProps({
    categories: {
        type: Object as PropType<Category[]>,
        default: [],
        required: true,
    }
}); //list of categories and their respected forums


//store
const forumsStore = useForumsStore();

/**
 * returns the forums in a specific category
 * @param category specific category
 */
const getForumsForCategory = (category: Category) => {
    return forumsStore.forums.filter((forum) => forum.categoryId === category.id);
};
</script>

<template>
    <!--TODO figure out the slug error and get the slug-->
    <ForumList v-for="category in props.categories" :key="category.id" :forums="getForumsForCategory(category)"
        :title="category.name" :categoryId="category.id" :slug="a" />
</template>
