import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useSourceDataStore } from "./SourceDataStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import type Post from "@/types/Post";

export const usePostsStore = defineStore("PostsStore", () => {
    const sourceDataStore = useSourceDataStore();

    const posts = ref(sourceDataStore.posts);

    const createPost = (post: Post) => {
        post.id = "qqqgg" + Math.random();
        posts.value.push(post);

        const thread = useThreadsStore().threads.find((thread) => thread.id === post.threadId);
        thread?.posts.push(post.id);
    };

    return { posts, createPost };
});
