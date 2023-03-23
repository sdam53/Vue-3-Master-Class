//pinia store to keep track of threads

import { ref } from "vue";
import { acceptHMRUpdate, defineStore } from "pinia";
import { useCurrentUserStore } from "./CurrentUserStore";
import { useForumsStore } from "./ForumsStore";
import { usePostsStore } from "./PostsStore";
import { useSourceDataStore } from "./SourceDataStore";
import { useUsersStore } from "./UsersStore";
import { docToResource, findById, stringToSlug, upsert } from "@/middleware/HelperFunctions";
import type Post from "@/types/Post";
import type Thread from "@/types/Thread";
import type User from "@/types/User";
import type Forum from "@/types/Forum";
import { fetchItem, fetchItems } from "@/middleware/db_helpers";
import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    DocumentSnapshot,
    FieldValue,
    getDoc,
    getFirestore,
    serverTimestamp,
    updateDoc,
    writeBatch
} from "@firebase/firestore";

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
        const thread: Thread = findById(threads.value, threadId) as Thread;
        if (!thread) return {};
        return {
            ...thread,
            author: findById(usersStore.users, thread.userId),
            repliesCount: thread.posts.length,
            contributorsCount: thread.contributors.length
        };
    };

    //function to create a new thread
    async function createThread(
        title: string,
        text: string,
        forumId: string
    ): Promise<Thread | null> {
        //if user is not signed in then no new thread for them
        if (!currentUserStore.authId) return null;

        //db and new thread reference
        let db = getFirestore();
        let threadRef = doc(collection(db, "threads"));

        //creating the thread
        let userId: string = currentUserStore.authId;
        let publishedAt: FieldValue = serverTimestamp();
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
        let userRef = doc(db, "users", userId);
        let forumRef = doc(db, "forums", forumId);
        //batch job to add new thread and append to the user and forum
        let batch = writeBatch(db);
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
        let post: Post = {
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

    //sets a thread into memory
    const setThread = (thread: Thread) => {
        upsert(threads.value, { ...thread });
    };

    //adds a thread to a forum
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

        let thread: Thread = findById(threads.value, threadId) as Thread;
        let user = findById(usersStore.users, userId);

        if (thread.contributors != null && thread.contributors.includes(userId)) {
            return;
        }
        thread.contributors = thread.contributors || [];
        thread.contributors.push(userId);
    };

    const appendPostToThread = (postId: string, threadId: string) => {
        const thread: Thread = findById(threads.value, threadId) as Thread;
        upsert(thread.posts, postId);
    };

    //updates a thread's title and text
    async function updateThread(title: string, text: string, id: string) {
        const thread: Thread = findById(threads.value, id) as Thread;
        const post: Post = findById(postStore.posts, thread.posts[0]) as Post;
        let newThread: Thread = { ...thread, title }; //using spread operator and overriding title
        let newPost: Post = { ...post, text }; //same but for post

        //getting db ref
        let db = getFirestore();
        let threadRef = doc(db, "threads", id);
        let postRef = doc(db, "posts", post.id);
        let batch = writeBatch(db);

        //batch updates
        batch.update(threadRef, { ...newThread });
        batch.update(postRef, { ...newPost });
        await batch.commit();

        //getting the new thread and post from db
        let newThreadDoc = await getDoc(threadRef);
        newThread = docToResource(newThreadDoc);
        let newPostDoc = await getDoc(postRef);
        newPost = docToResource(newPostDoc);

        //locally setting
        setThread({ ...newThread });
        postStore.setPost({ ...newPost });
        return docToResource(newThread);
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
        fetchThreads,
        setThread
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useThreadsStore, import.meta.hot));
}
