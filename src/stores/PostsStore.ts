//pinia store to keep track of posts

import { fetchItem, fetchItems } from "@/middleware/db_helpers";
import { upsert } from "@/middleware/HelperFunctions";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import type FetchItemOptionsType from "@/types/FetchItemOptionsType";
import type Post from "@/types/Post";
import {
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
import { getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import chunk from "lodash/chunk";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { useUsersStore } from "./UsersStore";

/**
 * post store
 */
export const usePostsStore = defineStore("PostsStore", () => {
    //stores
    const currentUser = useCurrentUserStore();
    const usersStore = useUsersStore();
    const threadsStore = useThreadsStore();

    //ref
    const posts = ref<Post[]>([]);

    /**
     * adds a new post to a thread
     * @param post the new post
     */
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

    /**
     * updates a post
     * @param post updated post
     */
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

    /**
     * caches a post into memory
     * @param post the post
     */
    const setPost = (post: Post) => {
        upsert(posts.value, { ...post });
    };

    /**
     * returns a list of posts by a user
     * only retrieves posts in memory
     * @param userId user id
     * @returns list of posts of a user
     */
    const getUserPosts = (userId: string): Post[] => {
        return posts.value.filter((post) => post.userId === userId);
    };

    /**
     * returns a users post count
     * only posts in memory
     * @param userId user id
     * @returns number of posts
     */
    const getUserPostCount = (userId: string): number => {
        return posts.value.filter((post) => post.userId === userId).length;
    };

    /**
     * fetches a post from firestorm
     * @param postId the postid
     * @returns post obj
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
     * @return list of post obj
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
     * this gets used for pages
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
     * fetches the user posts from firestore and stores it in memory
     * does not save snapshots
     * this gets used for infinite load
     * @userId the user id
     * @options the options param obj for pagnation fetching
     * if it is null then just get the recents
     * if options.startAfter is not null then startAfter method is used
     * @returns count boolean of whether there are more that 0 posts or not
     * Is used for infinite loading
     */
    async function fetchUserPosts(userId: string, options: any | null = null) {
        if (!usersStore.userExist(userId)) return false;
        const db = getFirestore();
        let q = null;
        if (options && options.startAfter) {
            const postRef = doc(db, "posts", options.startAfter.id);
            const post = await getDoc(postRef);
            q = query(
                collection(db, "posts"),
                where("userId", "==", userId),
                orderBy("publishedAt", "desc"),
                startAfter(post),
                limit(10)
            );
        } else {
            q = query(
                collection(db, "posts"),
                where("userId", "==", userId),
                orderBy("publishedAt", "desc"),
                limit(10)
            );
        }
        const posts = await getDocs(q);
        let count = 0;
        posts.forEach((post) => {
            count++;
            setPost({ ...post.data(), id: post.id } as Post);
        });
        return count > 0;
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
        fetchPostsByPage,
        fetchUserPosts
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePostsStore, import.meta.hot));
}
