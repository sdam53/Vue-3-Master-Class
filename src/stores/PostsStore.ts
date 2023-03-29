//pinia store to keep track of posts

import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import { upsert } from "@/middleware/HelperFunctions";
import type Post from "@/types/Post";
import { fetchItem, fetchItems } from "@/middleware/db_helpers";
import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getFirestore,
    increment,
    serverTimestamp,
    updateDoc,
    writeBatch
} from "@firebase/firestore";
import chunk from "lodash/chunk";
import type FetchItemOptionsType from "@/types/FetchItemOptionsType";

/**
 * post store
 */
export const usePostsStore = defineStore("PostsStore", () => {
    //stores
    //const sourceDataStore = useSourceDataStore();
    const currentUser = useCurrentUserStore();
    const threadsStore = useThreadsStore();

    //ref
    //const posts = ref(sourceDataStore.posts);
    const posts = ref<Post[]>([]);

    //function to create a new post to a thread
    async function createPost(post: Post) {
        //user not signed in so no posting allowed
        if (!currentUser.authId) return;

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
        batch.update(doc(db, "users", currentUser.authId), {
            postsCount: increment(1)
        });
        await batch.commit();

        //get the updated post
        let newPost = await getDoc(postRef);

        //update locally
        setPost({ ...newPost.data(), id: newPost.id } as Post);
        threadsStore.appendPostToThread(newPost.id, newPost.data()?.threadId);
        threadsStore.appendUserToThread(newPost.data()?.userId, newPost.data()?.threadId);
    }

    async function updatePost(post: Post) {
        let updatedPost: any = {
            text: post.text,
            edited: {
                at: serverTimestamp(),
                by: currentUser.authId,
                moderated: false
            }
        };
        let db = getFirestore();
        let postRef = doc(db, "posts", post.id);
        await updateDoc(postRef, updatedPost);
        updatedPost = await fetchItem(postRef.id, "posts");
        setPost({ ...updatedPost });
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
     * handles null posts by filtering
     * @param postIds the postids
     */
    async function fetchPosts(
        postIds: string[],
        options: FetchItemOptionsType | null = null
    ): Promise<Post[]> {
        let posts: Post[] = await fetchItems(postIds, "posts", options);
        posts = posts.filter((post) => post);
        posts.forEach((post) => setPost(post));
        return posts;
    }

    /**
     * fetches posts by page number
     * @param postIds the postids
     * @param pageNumber the page number
     * @param perPage how many posts per page
     * @returns Post[] list of the threads in that page
     */
    async function fetchPostsByPage(
        postIds: string[],
        pageNumber: number,
        perPage: number = 10,
        options: FetchItemOptionsType
    ) {
        clearPosts();
        const posts = chunk(postIds, perPage);
        const limitedIds = posts[pageNumber - 1];
        return fetchPosts(limitedIds, options);
    }

    /**
     * clears all cached posts
     */
    function clearPosts() {
        posts.value = [];
    }

    return {
        posts,
        createPost,
        updatePost,
        setPost,
        getUserPosts,
        getUserPostCount,
        fetchPost,
        fetchPosts,
        fetchPostsByPage
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePostsStore, import.meta.hot));
}
