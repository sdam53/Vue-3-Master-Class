import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useSourceDataStore } from "./SourceDataStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { useCurrentUserStore } from "./CurrentUserStore";
import type Post from "@/types/Post";

export const usePostsStore = defineStore("PostsStore", () => {
    const sourceDataStore = useSourceDataStore();
    const currentUser = useCurrentUserStore();

    const posts = ref(sourceDataStore.posts);

    const createPost = (post: Post) => {
        post.id = "qqqgg" + Math.random();
        post.userId = currentUser.authId;
        post.publishedAt = Math.floor(Date.now() / 1000);
        posts.value.push(post);
        const thread = useThreadsStore().threads.find((thread) => thread.id === post.threadId);
        thread?.posts.push(post.id);
    };

    const setPost = (post: Post) => {
        const index = posts.value.findIndex((p) => p.id === post.id);
        if (post.id && index !== -1) {
            posts.value[index] = post;
        } else {
            posts.value.push(post);
        }
    };

    return { posts, createPost, setPost };
});
