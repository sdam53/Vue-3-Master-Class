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
import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    DocumentSnapshot,
    getDoc,
    getFirestore,
    serverTimestamp,
    updateDoc,
    writeBatch
} from "@firebase/firestore";

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
    async function createPost(post: Post) {
        post.userId = currentUser.authId;
        post.publishedAt = serverTimestamp(); //Math.floor(Date.now() / 1000);

        //save the new post to the db
        let db = getFirestore();
        let colRef = collection(db, "posts");
        let batch = writeBatch(db);

        //creates the new post and stores to db
        //we use a batch in case a failure occurs
        //cant use .add in batch so yea
        //https://stackoverflow.com/questions/46725357/firestore-batch-add-is-not-a-function
        let postRef = doc(colRef);
        batch.set(postRef, post);
        batch.update(doc(db, "threads", post.threadId), {
            posts: arrayUnion(postRef.id),
            contributors: arrayUnion(post.userId)
        });
        await batch.commit();

        //TODO: server time stamp makes it so its NaN when posting until refresh
        let newPost = await getDoc(postRef);

        //update locally
        setPost({ ...newPost.data(), id: newPost.id } as Post);
        threadsStore.appendPostToThread(newPost.id, newPost.data()?.threadId);
        threadsStore.appendUserToThread(newPost.data()?.userId, newPost.data()?.threadId);
    }

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
