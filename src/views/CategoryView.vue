<script setup lang="ts">
//page to show different categories of forums.
//navigate by clicking on a category
import ForumList from "@/components/ForumListComponent.vue";
import { findById } from "@/middleware/HelperFunctions";
import router from "@/router";
import { useCategoriesStore } from "@/stores/CategoriesStore.js";
import { useForumsStore } from "@/stores/ForumsStore.js";
import type Category from "@/types/Category";
import { useAsyncState } from "@vueuse/core";
import { computed, defineProps } from "vue";

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
        required: false
    }
});

//emits
const emits = defineEmits(["ready"]);

//computed data
const category = computed<Category>(() => {
    return findById(categoriesStore.categories, props.id) as Category;
});

//function to get forums for a certain category
//this is needed anymore as any forum should already be in that category
//since we clear everything at each router change
const getForumsForCategory = (category: Category) => {
    return forumsStore.forums.filter((forum) => forum.categoryId === category.id);
};

const { isReady } = useAsyncState(async () => {
    const category = await categoriesStore.fetchCategory(props.id)
    await forumsStore.fetchForums(category.forums)
    
    isOnValidPage();
    document.title = category.value.name;
    console.log(props);
    
    emits("ready");
}, undefined);

/**
 * checks if user is on a valid url in terms of the slug.
 */
const isOnValidPage = () => {
    //checks if the slug is there and correct, else redirect to fix the url
    if (props.slug !== category.value.slug) {
        router.push({
            name: "Category",
            params: { id: category.value.id, slug: category.value.slug }
        });
    }
};
</script>

<template>
    <div v-if="isReady" class="col-full push-top">
        <h1>{{ category?.name }}</h1>
        <ForumList
            :forums="getForumsForCategory(category)"
            :title="'Forums'"
            :slug="category.slug"
            :category-id="category.id"
        />
    </div>
</template>
