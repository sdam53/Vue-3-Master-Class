<script setup lang="ts">
//page that shows individual threads
import PostListComponent from "@/components/PostListComponent.vue";
import PostEditorComponent from "@/components/PostEditorComponent.vue";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { usePostsStore } from "@/stores/PostsStore";
import { ref, computed, defineProps } from "vue";

const threadsStore = useThreadsStore();
const postsStore = usePostsStore();
const threads = ref(threadsStore.threads);
const posts = ref(postsStore.posts);
const props = defineProps(["id", "slug"]);
const thread = computed(() => {
    //console.log(threads.value.find((thread) => thread.id === props.id));
    return threads.value.find((thread) => thread.id === props.id);
});
const threadPosts = computed(() => {
    return posts.value.filter((post) => post.threadId === props.id);
});

//TODO look into eventData type
const addPost = (eventData: any) => {
    const post = {
        ...eventData.post,
        threadId: props.id
    };
    //posts.value.push(post);
    //thread.value.posts.push(post.id);
    postsStore.createPost(post);
};
</script>

<template>
    <div class="col-large push-top">
        <h1>{{ thread?.title }}</h1>
        <PostListComponent :posts="threadPosts" />
        <PostEditorComponent @savePost="addPost" />
    </div>
</template>
