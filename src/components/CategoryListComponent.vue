<script setup lang="ts">
//shows up in the home page
import ForumList from "@/components/ForumListComponent.vue";
import { useForumsStore } from "@/stores/ForumsStore";
import type Category from "@/types/Category";
import { defineProps } from "vue";

const forumsStore = useForumsStore();
const props = defineProps(["categories"]); //list of categories and their respected forums

const getForumsForCategory = (category: Category) => {
    return forumsStore.forums.filter((forum) => forum.categoryId === category.id);
};
</script>

<template>
    <ForumList
        v-for="category in props.categories"
        :key="category.id"
        :forums="getForumsForCategory(category)"
        :title="category.name"
        :categoryId="category.id"
    />
</template>
