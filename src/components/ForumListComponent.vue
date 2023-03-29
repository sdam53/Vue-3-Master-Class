<script setup lang="ts">
//component to display forums and their respected threads

import type Forum from "@/types/Forum";
import type { PropType } from "vue";

//props
const props = defineProps({
    forums: {
        type: Object as PropType<Forum[]>,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    categoryId: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    }
});

/**
 * returns the string to use depending on how much threads a forum has
 * @param forum the forum
 * @returns thread word to account for singualr or plural
 */
const forumThreadsWord = (forum: Forum): string => {
    if (forum.threads?.length) {
        return forum.threads.length > 1 ? "threads" : "thread";
    } else {
        return "threads";
    }
};

/**
 * returns the amount of threads a forum has
 * @param forum the forum
 * @return thread count or 0
 */
const forumThreadsCount = (forum: Forum): number => {
    if (forum.threads?.length) {
        return forum.threads.length;
    } else {
        return 0;
    }
};
</script>

<template>
    <div class="col-full">
        <div class="forum-list">
            <h2 class="list-title">
                <router-link
                    v-if="props.categoryId"
                    :to="{
                        name: 'Category',
                        params: { id: categoryId, slug: props.slug }
                    }"
                    >{{ props.title }}</router-link
                >
                <span v-else>{{ props.title }}</span>
            </h2>

            <div class="forum-listing" v-for="forum in props.forums" :key="forum.id">
                <div class="forum-details">
                    <router-link
                        :to="{ name: 'Forum', params: { id: forum.id, slug: forum.slug } }"
                        class="text-xlarge"
                    >
                        {{ forum.name }}
                    </router-link>

                    <p>{{ forum.description }}</p>
                </div>

                <div class="threads-count">
                    <p>
                        <span class="count">{{ forumThreadsCount(forum) }}</span>
                        {{ forumThreadsWord(forum) }}
                    </p>
                </div>

                <div class="last-thread"></div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
