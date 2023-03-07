//pinia store to keep track of threads

import type Post from "@/types/Post";
import type Thread from "@/types/Thread";
import type User from "@/types/User";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { useCurrentUserStore } from "./CurrentUserStore";
import { useForumsStore } from "./ForumsStore";
import { usePostsStore } from "./PostsStore";
import { useSourceDataStore } from "./SourceDataStore";
import { useUsersStore } from "./UsersStore";
import { stringToSlug } from "@/middleware/HelperFunctions";

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
    const threads = ref(sourceDataStore.threads);

    //function to create a new thread
    async function createThread(title: string, text: string, forumId: string) {
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
        appendThreadToUser(userId, id);
        appendThreadToForum(forumId, id);
        let post: Post = {
            text: text,
            threadId: thread.id,
            //need it in type Post
            publishedAt: 0,
            userId: "0",
            id: "0"
        };
        postStore.createPost(post);
        return threads.value.find((thread) => thread.id === id);
    }

    //sets a thread
    const setThread = (thread: Thread) => {
        const index = threads.value.findIndex((t) => t.id === thread.id);
        if (thread.id && index !== -1) {
            threads.value[index] = thread;
        } else {
            threads.value.push(thread);
        }
    };

    //adds a thread to a forum
    const appendThreadToForum = (forumId: string, threadId: string) => {
        const forum = forumStore.forums.find((forum) => forum.id === forumId);
        forum?.threads.push(threadId);
    };

    //adds a user to a thread
    const appendThreadToUser = (userId: string, threadId: string) => {
        //TODO: Figure out user and thread and post
        const user: User = usersStore.users.find((user) => user.id === userId);
        user.threads = user.threads || [];
        user.threads.push(threadId);
    };

    //updates a thread's title and text
    async function updateThread(title: string, text: string, id: string) {
        const thread: Thread = threads.value.find((thread) => thread.id === id);
        const post: Post = postStore.posts.find((post) => post.id === thread.posts[0]);
        const newThread: Thread = { ...thread, title }; //using spread operator and overriding title
        const newPost: Post = { ...post, text }; //same but for post
        setThread(newThread);
        postStore.setPost(newPost);
        return newThread;
    }

    return { threads, createThread, updateThread };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useThreadsStore, import.meta.hot));
}
