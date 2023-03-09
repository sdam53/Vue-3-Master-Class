//pinia store to keep track of posts

import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { useSourceDataStore } from "./SourceDataStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { useCurrentUserStore } from "./CurrentUserStore";
import { doc, onSnapshot } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { findById, stringToSlug, upsert } from "@/middleware/HelperFunctions";
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

    async function fetchPost(postId: string): Promise<Post | null> {
        console.log("Fetching Post");
        let db = getFirestore();
        //return null;
        return new Promise((resolve) => {
            let docRef = doc(db, "posts", postId);
            onSnapshot(docRef, (doc) => {
                let docItem = doc.data();
                let post: Post = {
                    publishedAt: docItem?.publishedAt,
                    text: docItem?.text,
                    threadId: docItem?.threadId,
                    userId: docItem?.userId,
                    id: doc.id
                };

                setPost({ ...post });
                resolve({ ...post });
            });
        });
    }

    return { posts, createPost, setPost, getUserPosts, getUserPostCount, fetchPost };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePostsStore, import.meta.hot));
}
