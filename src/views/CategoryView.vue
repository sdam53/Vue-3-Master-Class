<script setup lang="ts">
//page to show different categories of forums.
//navigate by clicking on a category
//TODO: ATM slug doesnt display
//we get sent here by the ForumListComponent
import { computed, defineProps, nextTick } from "vue";
import ForumListComponent from "@/components/ForumListComponent.vue";
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

//emits
const emits = defineEmits(["ready"])

//computed data
const category = computed(() => {
    return findById(categoriesStore.categories, props.id) as Category;
});

//function to get forums for a certain category
const getForumsForCategory = (category: Category) => {
    return forumsStore.forums.filter((forum) => forum.categoryId === category.id);
};

//
const { isReady } = useAsyncState(async () => {
    if (category.value === undefined) {
        let category = await categoriesStore.fetchCategory(props.id) as Category;
        await forumsStore.fetchForums(category.forums);
    }
    document.title = category.value.name;
    emits("ready")
}, undefined);

</script>

<template>
    <div v-if="isReady" class="container push-top">
        <h1>{{ category?.name }}</h1>
        <ForumListComponent :forums="getForumsForCategory(category)" :title="'Forums'" :slug="category.slug"
            :category-id="category.id" />
    </div>
</template>
