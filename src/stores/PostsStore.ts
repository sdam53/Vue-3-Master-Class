//pinia store to keep track of posts

import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { useSourceDataStore } from "./SourceDataStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { useCurrentUserStore } from "./CurrentUserStore";
import { findById } from "@/middleware/HelperFunctions";
import type Post from "@/types/Post";
import type Thread from "@/types/Thread";

/**
 * post store
 */
export const usePostsStore = defineStore("PostsStore", () => {
    //stores
    const sourceDataStore = useSourceDataStore();
    const currentUser = useCurrentUserStore();
    const threadsStore = useThreadsStore();

    //ref
    const posts = ref(sourceDataStore.posts);

    //function to create a new post to a thread
    const createPost = (post: Post) => {
        post.id = "qqqgg" + Math.random();
        post.userId = currentUser.authId;
        post.publishedAt = Math.floor(Date.now() / 1000);
        posts.value.push(post);
        const thread: Thread = findById(threadsStore.threads, post.threadId);
        thread?.posts.push(post.id);
        threadsStore.appendUserToThread(post.userId, post.threadId);
    };

    //function to set a post
    const setPost = (post: Post) => {
        const index = posts.value.findIndex((p) => p.id === post.id);
        if (post.id && index !== -1) {
            posts.value[index] = post;
        } else {
            posts.value.push(post);
        }
    };

    //function to get a specific user's posts count
    const getUserPosts = (userId: string): Post[] => {
        return posts.value.filter((post) => post.userId === userId);
    };

    //function to get a specific user's posts count
    const getUserPostCount = (userId: string): number => {
        return posts.value.filter((post) => post.userId === userId).length;
    };

    return { posts, createPost, setPost, getUserPosts, getUserPostCount };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePostsStore, import.meta.hot));
}
