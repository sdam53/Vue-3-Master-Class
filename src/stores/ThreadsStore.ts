//pinia store to keep track of threads

import { fetchItem, fetchItems } from "@/middleware/db_helpers";
import { docToResource, findById, stringToSlug, upsert } from "@/middleware/HelperFunctions";
import type FetchItemOptionsType from "@/types/FetchItemOptionsType";
import type Forum from "@/types/Forum";
import type Post from "@/types/Post";
import type Thread from "@/types/Thread";
import type User from "@/types/User";
import {
    arrayUnion,
    collection,
    doc,
    FieldValue,
    getDoc,
    getFirestore,
    serverTimestamp,
    writeBatch
} from "@firebase/firestore";
import { getDocs, limit, query, startAfter } from "firebase/firestore";
import chunk from "lodash/chunk";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { useCurrentUserStore } from "./CurrentUserStore";
import { useForumsStore } from "./ForumsStore";
import { usePostsStore } from "./PostsStore";
import { useUsersStore } from "./UsersStore";

/**
 * threads store
 */
export const useThreadsStore = defineStore("ThreadsStore", () => {
    //stores
    const currentUserStore = useCurrentUserStore();
    const postStore = usePostsStore();
    const forumStore = useForumsStore();
    const usersStore = useUsersStore();

    //ref
    const threads = ref<Thread[]>([]);

    /**
     * creates a new thread to a forum
     * @param title thread title
     * @param text thread text
     * @param forumId forum id to attach the thread to
     * @returns the new thread created
     */
    async function createThread(
        title: string,
        text: string,
        forumId: string
    ): Promise<Thread | null> {
        //if user is not signed in then no new thread for them
        if (!currentUserStore.authId) return null;

        //db and new thread reference
        const db = getFirestore();
        const threadRef = doc(collection(db, "threads"));

        //creating the thread
        const userId: string = currentUserStore.authId;
        const publishedAt: FieldValue = serverTimestamp();
        const thread: Thread = {
            contributors: [],
            firstPostId: "", //im asuming this means the id of the post not the user
            forumId: forumId,
            lastPostAt: 12,
            lastPostId: "12",
            posts: [],
            publishedAt: publishedAt,
            slug: stringToSlug(title),
            title: title,
            userId: userId,
            id: threadRef.id
        };
        //getting user and forum ref
        const userRef = doc(db, "users", userId);
        const forumRef = doc(db, "forums", forumId);
        //batch job to add new thread and append to the user and forum
        const batch = writeBatch(db);
        batch.set(threadRef, thread);
        batch.update(userRef, {
            threads: arrayUnion(threadRef.id)
        });
        batch.update(forumRef, {
            threads: arrayUnion(threadRef.id)
        });
        await batch.commit();
        //the new thread
        const newThread = await getDoc(threadRef);
        //setting thread locally
        setThread(newThread.data() as Thread);
        appendThreadToUser(userId, threadRef.id); //user.threads
        appendUserToThread(userId, threadRef.id); //thread.contributors
        appendThreadToForum(forumId, threadRef.id); //forum.threads
        const post: Post = {
            text: text,
            threadId: thread.id,
            //need it in type Post, it gets handled in createPost
            publishedAt: 0,
            userId: "0",
            id: "0"
        };
        await postStore.createPost(post);
        return findById(threads.value, threadRef.id) as Thread;
    }

    /**
     * sets a thread into memory
     * @param thread the thread
     */
    const setThread = (thread: Thread) => {
        upsert(threads.value, { ...thread });
    };

    /**
     * adds a thread to a forum
     * @param forumId forum id
     * @param threadId thread id
     */
    const appendThreadToForum = (forumId: string, threadId: string) => {
        const forum: Forum = findById(forumStore.forums, forumId) as Forum;
        forum?.threads.push(threadId);
    };

    //adds a thread to a user
    //should this be used only when a user creates a thread? i think so
    const appendThreadToUser = (userId: string, threadId: string) => {
        const user: User = findById(usersStore.users, userId) as User;
        if (user.threads != null && user.threads.includes(threadId)) {
            return;
        }
        user.threads = user.threads || [];
        user.threads.push(threadId);
    };

    //adds a user to a thread
    const appendUserToThread = (userId: string, threadId: string) => {
        if (!currentUserStore.isSignedIn || currentUserStore.authId !== userId) return;

        const thread: Thread = findById(threads.value, threadId) as Thread;
        const user = findById(usersStore.users, userId);

        if (thread.contributors != null && thread.contributors.includes(userId)) {
            return;
        }
        thread.contributors = thread.contributors || [];
        thread.contributors.push(userId);
    };

    /**
     * appends postid to a thread
     * @param postId post id
     * @param threadId thread id
     */
    const appendPostToThread = (postId: string, threadId: string) => {
        const thread: Thread = findById(threads.value, threadId) as Thread;
        upsert(thread.posts, postId);
    };

    /**
     * update a thread's title and text
     * @param title new thread title
     * @param text new thead text
     * @param id thread id
     * @returns the new thread
     */
    async function updateThread(title: string, text: string, id: string) {
        const thread: Thread = findById(threads.value, id) as Thread;
        const post: Post = findById(postStore.posts, thread.posts[0]) as Post;
        let newThread: Thread = { ...thread, title }; //using spread operator and overriding title
        let newPost: Post = { ...post, text }; //same but for post

        //getting db ref
        const db = getFirestore();
        const threadRef = doc(db, "threads", id);
        const postRef = doc(db, "posts", post.id);
        const batch = writeBatch(db);

        //batch updates
        batch.update(threadRef, { ...newThread });
        batch.update(postRef, { ...newPost });
        await batch.commit();

        //getting the new thread and post from db
        const newThreadDoc = await getDoc(threadRef);
        newThread = docToResource(newThreadDoc);
        const newPostDoc = await getDoc(postRef);
        newPost = docToResource(newPostDoc);

        //locally setting
        setThread({ ...newThread });
        postStore.setPost({ ...newPost });
        return docToResource(newThread);
    }

    /**
     * fetchs a thread from firestore and stores it into memory and returns it
     * @param threadId thread id
     * @param options options obj for fetching
     * @returns the thread obj
     */
    async function fetchThread(
        threadId: string,
        options: FetchItemOptionsType | null = null
    ): Promise<Thread> {
        const thread = await fetchItem(threadId, "threads", options);
        setThread({ ...thread });
        return { ...thread };
    }

    /**
     * fetches threads from firestore
     * @param threadIds list of thread ids
     * @returns list of threads
     */
    async function fetchThreads(threadIds: string[]): Promise<Thread[]> {
        const threads: Thread[] = await fetchItems(threadIds, "threads");
        threads.forEach((thread) => setThread(thread));
        return threads;
    }

    /**
     * fetches threads by page number
     * @param threadIds the threadsids
     * @param pageNumber the page number
     * @param perPage how many threads per page
     * @returns Thread[] list of the threads in that page
     */
    async function fetchThreadsByPage(
        threadIds: string[],
        pageNumber: number,
        perPage: number = 10
    ): Promise<Thread[]> {
        clearThreads();
        const threads = chunk(threadIds, perPage);
        const limitedIds = threads[pageNumber - 1];
        return limitedIds ? fetchThreads(limitedIds) : [];
    }

    /**
     * fetches all the threads from firestore and stores it in memory
     * does not save snapshots
     * this gets used for infinite load
     * I would prefer pagination, but it looks like theres no nice/cheap solution
     * for the web sdk, only server sdk
     * orderby is commented due to a bug when reaching end of threads
     * it will keep fetching the last thread
     * @options the options param obj for infinite loading fetching
     * if it is null then just get the recents
     * if options.startAfter is not null then startAfter method is used
     * @returns count boolean if it fetched more than 0 posts
     * Is used for infinite loading
     */
    async function fetchAllThreads(options: { startAfter: Thread | null } | null = null) {
        const db = getFirestore();
        let q = null;
        if (options && options.startAfter) {
            const threadDoc = doc(db, "threads", options.startAfter.id);
            const thread = await getDoc(threadDoc);
            q = query(
                collection(db, "threads"),
                //orderBy("lastPostAt", "desc"),
                startAfter(thread),
                limit(10)
            );
        } else {
            q = query(
                collection(db, "threads"),
                //orderBy("publishedAt", "desc"),
                limit(10)
            );
        }
        const threads = await getDocs(q);
        let count = 0;
        threads.forEach((thread) => {
            count++;
            setThread({ ...thread.data(), id: thread.id } as Thread);
        });
        return count > 0;
    }

    /**
     * clears all cached threads
     */
    function clearThreads() {
        threads.value = [];
    }

    return {
        threads,
        createThread,
        updateThread,
        appendThreadToUser,
        appendUserToThread,
        appendPostToThread,
        fetchThread,
        fetchThreads,
        fetchThreadsByPage,
        fetchAllThreads,
        setThread,
        clearThreads
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useThreadsStore, import.meta.hot));
}
