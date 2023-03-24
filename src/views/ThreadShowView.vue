<script async setup lang="ts">
//page that shows a individual thread and its posts

import { computed } from "vue";
import PostListComponent from "@/components/PostListComponent.vue";
import PostEditorComponent from "@/components/PostEditorComponent.vue";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { usePostsStore } from "@/stores/PostsStore";
import type Post from "@/types/Post";
import { findById, diffForHumans } from "@/middleware/HelperFunctions";
import { useUsersStore } from "@/stores/UsersStore";
import type Thread from "@/types/Thread";
import type User from "@/types/User";
import { useAsyncState } from "@vueuse/core";
import router from "@/router";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";

//stores
const threadsStore = useThreadsStore();
const postsStore = usePostsStore();
const usersStore = useUsersStore();
const currentUserStore = useCurrentUserStore();

//prop
//const props = defineProps(["id", "slug"]);
const props = defineProps({
    id: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: false
    }
});

//emits
const emits = defineEmits(["ready", "notReady"]);

//ref
//const creator = await usersStore.fetchUser(thread.userId);

//computed
const threads = computed<Thread[]>(() => threadsStore.threads);
const posts = computed<Post[]>(() => postsStore.posts);
const thread = computed<Thread>(() => findById(threadsStore.threads, props.id) as Thread);
const threadPosts = computed<Post[]>(() => {
    return postsStore.posts.filter((post: Post) => post.threadId === props.id);
});
const creator = computed<User>(() => usersStore.getUser(thread.value?.userId) as User);
const isSignedIn = computed(() => currentUserStore.isSignedIn);
const isCreator = computed(() => isSignedIn.value && currentUserStore.authId === creator.value.id);

/**
 * function to add a post to a thread
 * @param eventData the event
 */
//TODO look into eventData type. It is Event but .post doesnt exist in that type
const addPost = (eventData: any) => {
    const post: Post = {
        ...eventData,
        threadId: props.id
    };
    postsStore.createPost(post);
};

const { isReady } = useAsyncState(async () => {
    //fetches all posts and user in a thread and saves it to memory
    let thread = await threadsStore.fetchThread(props.id);

    //updates the slug if the user used an incorrect one by redirecting
    if (props.slug !== thread.slug) {
        router.push({ name: "ThreadShow", params: { id: thread.id, slug: thread.slug } });
    } else {
        //continue on
        usersStore.fetchUser(thread.userId);
        let posts = await postsStore.fetchPosts(thread.posts);
        let users = posts.map((post: Post) => post.userId);
        usersStore.fetchUsers(users);
        document.title = thread.title;
        emits("ready");
    }
}, undefined);
</script>

<template>
    <div v-if="isReady" class="col-large push-top">
        <!--Edit thread button-->
        <h1>
            {{ thread?.title }}
            <router-link
                v-if="isCreator"
                :to="{ name: 'ThreadEdit' }"
                class="btn-green btn-small"
                tag="button"
                >Edit Thread</router-link
            >
        </h1>
        <!--thread info-->
        <p>
            By <b>{{ creator?.name }}</b
            ><a href="#" class="link-unstyled">{{}}</a>,
            <i>{{ diffForHumans(thread.publishedAt.seconds || thread.publishedAt) }}.</i>
            <span style="float: right; margin-top: 2px" class="hide-mobile text-faded text-small"
                >{{ thread?.posts?.length || 0 }} replies by
                {{ thread?.contributors?.length || 0 }} contributor/s</span
            >
        </p>
        <!--List of posts-->
        <PostListComponent :posts="threadPosts" />
        <!--Post editor for adding more posts/login and register-->
        <PostEditorComponent v-if="isSignedIn" @savePost="addPost" />
        <div v-else class="text-center" style="margin-bottom: 50px">
            <router-link :to="{ name: 'Login', query: { redirectTo: $route.path } }"
                >Sign In</router-link
            >
            or
            <router-link :to="{ name: 'Register', query: { redirectTo: $route.path } }"
                >Register</router-link
            >
            to reply.
        </div>
    </div>
</template>
