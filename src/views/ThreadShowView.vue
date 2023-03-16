<script async setup lang="ts">
//page that shows a individual thread and its posts

import { computed, ref, type Ref } from "vue";
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

//stores
const threadsStore = useThreadsStore();
const postsStore = usePostsStore();
const usersStore = useUsersStore();

//prop
//TODO: it requires a slug but it actually isnt being used
const props = defineProps(["id", "slug"]);

//ref
//const creator = await usersStore.fetchUser(thread.userId);

//computed
const threads = computed(() => threadsStore.threads);
const posts = computed(() => postsStore.posts);
const thread = computed(() => findById(threadsStore.threads, props.id));
const threadPosts = computed(() => {
    return postsStore.posts.filter((post: Post) => post.threadId === props.id);
});
const creator = computed(() => usersStore.getUser(thread.value.userId));

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
    console.log(post);

    postsStore.createPost(post);
};

const { isReady } = useAsyncState(async () => {
    //fetches all posts and user in a thread and saves it to memory
    let thread = await threadsStore.fetchThread(props.id);
    usersStore.fetchUser(thread.userId);
    let posts = await postsStore.fetchPosts(thread.posts);
    let users = posts.map((post: Post) => post.userId);
    await usersStore.fetchUsers(users);
}, undefined);

</script>

<template>
    <div v-if="isReady" class="col-large push-top">
        <h1>
            {{ thread?.title }}
            <!--Somehow this doesnt take params and just knows where to send you-->
            <router-link :to="{ name: 'ThreadEdit' }" class="btn-green btn-small" tag="button">Edit Thread</router-link>
        </h1>
        <p>
            By <b>{{ creator?.name }}</b><a href="#" class="link-unstyled">{{}}</a>,
            <i>{{ diffForHumans(thread.publishedAt.seconds || thread.publishedAt) }}.</i>
            <span style="float: right; margin-top: 2px" class="hide-mobile text-faded text-small">{{ thread?.posts?.length
                || 0 }} replies by
                {{ thread?.contributors?.length || 0 }} contributor/s</span>
        </p>
        <PostListComponent :posts="threadPosts" />
        <PostEditorComponent @savePost="addPost" />
    </div>
</template>
