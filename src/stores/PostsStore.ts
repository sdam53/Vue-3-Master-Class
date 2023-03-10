//pinia store to keep track of posts

import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { useSourceDataStore } from "./SourceDataStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import { findById, stringToSlug, upsert } from "@/middleware/HelperFunctions";
import type Post from "@/types/Post";
import type Thread from "@/types/Thread";
import { fetchItem, fetchItems } from "@/middleware/db_helpers";

/**
 * post store
 */
export const usePostsStore = defineStore("PostsStore", () => {
    //stores
    const sourceDataStore = useSourceDataStore();
    const currentUser = useCurrentUserStore();
    const threadsStore = useThreadsStore();

    //ref
    //const posts = ref(sourceDataStore.posts);
    const posts = ref<Post[]>([]);

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
        upsert(posts.value, { ...post });
    };

    //function to get a specific user's posts count
    const getUserPosts = (userId: string): Post[] => {
        return posts.value.filter((post) => post.userId === userId);
    };

    //function to get a specific user's posts count
    const getUserPostCount = (userId: string): number => {
        return posts.value.filter((post) => post.userId === userId).length;
    };

    /**
     * fetches a post from firestorm
     * @param postId the postid
     */
    async function fetchPost(postId: string): Promise<Post> {
        let post = await fetchItem(postId, "posts");
        setPost({ ...post });
        return { ...post };
    }

    /**
     * fetchs multiple posts from firestorm
     * @param postIds the postids
     */
    async function fetchPosts(postIds: string[]): Promise<Post[]> {
        let posts: Post[] = await fetchItems(postIds, "posts");
        posts.forEach((post) => setPost(post));
        return posts;
    }

    return { posts, createPost, setPost, getUserPosts, getUserPostCount, fetchPost, fetchPosts };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePostsStore, import.meta.hot));
}
