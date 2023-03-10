//pinia store to keep track of threads

import { ref } from "vue";
import { acceptHMRUpdate, defineStore } from "pinia";
import { useCurrentUserStore } from "./CurrentUserStore";
import { useForumsStore } from "./ForumsStore";
import { usePostsStore } from "./PostsStore";
import { useSourceDataStore } from "./SourceDataStore";
import { useUsersStore } from "./UsersStore";
import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { findById, stringToSlug, upsert } from "@/middleware/HelperFunctions";
import type Post from "@/types/Post";
import type Thread from "@/types/Thread";
import type User from "@/types/User";
import type Forum from "@/types/Forum";
import { fetchItem, fetchItems } from "@/middleware/db_helpers";

/**
 * threads store
 */
export const useThreadsStore = defineStore("ThreadsStore", () => {
    //store
    const sourceDataStore = useSourceDataStore();
    const currentUserStore = useCurrentUserStore();
    const postStore = usePostsStore();
    const forumStore = useForumsStore();
    const usersStore = useUsersStore();

    //ref
    //const threads = ref(sourceDataStore.threads);
    const threads = ref<Thread[]>([]);

    //computed data
    const threadInfo = (threadId: string) => {
        const thread: Thread = findById(threads.value, threadId);
        if (!thread) return {};
        return {
            ...thread,
            author: findById(usersStore.users, thread.userId),
            repliesCount: thread.posts.length,
            contributorsCount: thread.contributors.length
        };
    };

    //function to create a new thread
    async function createThread(title: string, text: string, forumId: string): Promise<Thread> {
        let id: string = "qqqgg" + Math.random();
        let userId: string = currentUserStore.authId;
        let publishedAt: number = Math.floor(Date.now() / 1000);
        const thread: Thread = {
            contributors: [],
            firstPostId: "as",
            forumId: forumId,
            lastPostAt: 12,
            lastPostId: "12",
            posts: [],
            publishedAt: publishedAt,
            slug: stringToSlug(title),
            title: title,
            userId: userId,
            id: id
        };
        setThread(thread);
        appendThreadToUser(userId, id); //user.threads
        appendUserToThread(userId, id); //thread.contributors
        appendThreadToForum(forumId, id); //forum.threads
        let post: Post = {
            text: text,
            threadId: thread.id,
            //need it in type Post
            publishedAt: 0,
            userId: "0",
            id: "0"
        };
        postStore.createPost(post);
        return findById(threads.value, id);
    }

    //sets a thread into memory
    const setThread = (thread: Thread) => {
        upsert(threads.value, { ...thread });
    };

    //adds a thread to a forum
    const appendThreadToForum = (forumId: string, threadId: string) => {
        const forum: Forum = findById(forumStore.forums, forumId);
        forum?.threads.push(threadId);
    };

    //adds a thread to a user
    //should this be used only when a user creates a thread? i think so
    const appendThreadToUser = (userId: string, threadId: string) => {
        const user: User = findById(usersStore.users, userId);
        if (user.threads != null && user.threads.includes(threadId)) {
            return;
        }
        user.threads = user.threads || [];
        user.threads.push(threadId);
    };

    //adds a user to a thread
    const appendUserToThread = (userId: string, threadId: string) => {
        const thread: Thread = findById(threads.value, threadId);
        /*
        if (thread.contributors.includes(userId)) {
            console.log("NOOOOO");
            return;
        }
        console.log("yes");
        thread.contributors.push(userId);
        */
        upsert(thread.contributors, userId);
    };

    const appendPostToThread = (postId: string, threadId: string) => {
        const thread: Thread = findById(threads.value, threadId);
        upsert(thread.posts, postId);
    };

    //updates a thread's title and text
    async function updateThread(title: string, text: string, id: string) {
        const thread: Thread = findById(threads.value, id);
        const post: Post = findById(postStore.posts, thread.posts[0]);
        const newThread: Thread = { ...thread, title }; //using spread operator and overriding title
        const newPost: Post = { ...post, text }; //same but for post
        setThread(newThread);
        postStore.setPost(newPost);
        return newThread;
    }

    /**
     * fetches the thread from firestore
     * @param threadId the thread id
     */
    async function fetchThread(threadId: string): Promise<Thread> {
        let thread = await fetchItem(threadId, "threads");
        setThread({ ...thread });
        return { ...thread };
    }

    /**
     * fetches threads from firestore
     * @param threadIds list of thread ids
     */
    async function fetchThreads(threadIds: string[]): Promise<Thread[]> {
        let threads: Thread[] = await fetchItems(threadIds, "threads");
        threads.forEach((thread) => setThread(thread));
        return threads;
    }

    return {
        threads,
        createThread,
        updateThread,
        appendThreadToUser,
        appendUserToThread,
        appendPostToThread,
        fetchThread,
        fetchThreads
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useThreadsStore, import.meta.hot));
}
