import type Post from "@/types/Post";
import type Thread from "@/types/Thread";
import type User from "@/types/User";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useCurrentUserStore } from "./CurrentUserStore";
import { useForumsStore } from "./ForumsStore";
import { usePostsStore } from "./PostsStore";
import { useSourceDataStore } from "./SourceDataStore";
import { useUsersStore } from "./UsersStore";

export const useThreadsStore = defineStore("ThreadsStore", () => {
    const sourceDataStore = useSourceDataStore();
    const currentUserStore = useCurrentUserStore();
    const forumStore = useForumsStore();
    const usersStore = useUsersStore();
    const postStore = usePostsStore();
    const threads = ref(sourceDataStore.threads);

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
            slug: "Asd",
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

    const setThread = (thread: Thread) => {
        threads.value.push(thread);
    };

    const appendThreadToForum = (forumId: string, threadId: string) => {
        const forum = forumStore.forums.find((forum) => forum.id === forumId);
        forum?.threads.push(threadId);
    };

    const appendThreadToUser = (userId: string, threadId: string) => {
        //TODO: Figure out user
        const user: User = usersStore.users.find((user) => user.id === userId);
        user.threads = user.threads || [];
        user.threads.push(threadId);
    };

    return { threads, createThread };
});
