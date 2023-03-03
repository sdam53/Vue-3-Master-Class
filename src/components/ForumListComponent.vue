<script setup lang="ts">
import type Forum from "@/types/Forum";
import { defineProps } from "vue";

const props = defineProps(["forums", "title", "categoryId", "slug"]);

const forumThreadsWord = (forum: Forum) => {
    if (forum.threads?.length) {
        return forum.threads.length > 1 ? "threads" : "thread";
    } else {
        return "threads";
    }
};
const forumThreadsCount = (forum: Forum) => {
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
                        params: { id: categoryId, slug: 'asd' }
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
