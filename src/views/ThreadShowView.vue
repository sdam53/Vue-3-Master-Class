<script setup lang="ts">
//page that shows a individual thread and its posts

import { computed } from "vue";
import PostListComponent from "@/components/PostListComponent.vue";
import PostEditorComponent from "@/components/PostEditorComponent.vue";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { usePostsStore } from "@/stores/PostsStore";
import type Post from "@/types/Post";
import { findById } from "@/middleware/HelperFunctions";

//stores
const threadsStore = useThreadsStore();
const postsStore = usePostsStore();

//prop
//TODO: it requires a slug but it actually isnt being used
const props = defineProps(["id", "slug"]);

//computed data
const thread = computed(() => {
    return findById(threadsStore.threads, props.id);
});
const threadPosts = computed(() => {
    return postsStore.posts.filter((post) => post.threadId === props.id);
});

/**
 * function to add a post to a thread
 * @param eventData the event
 */
//TODO look into eventData type. It is Event but .post doesnt exist in that type
const addPost = (eventData: any) => {
    const post: Post = {
        ...eventData.post,
        threadId: props.id
    };
    postsStore.createPost(post);
};
</script>

<template>
    <div class="col-large push-top">
        <h1>
            {{ thread?.title }}

            <!--Somehow this doesnt take params and just knows where to send you-->
            <router-link :to="{ name: 'ThreadEdit' }" class="btn-green btn-small" tag="button"
                >Edit Thread</router-link
            >
        </h1>
        <PostListComponent :posts="threadPosts" />
        <PostEditorComponent @savePost="addPost" />
    </div>
</template>
