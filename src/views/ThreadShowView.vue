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

//stores
const threadsStore = useThreadsStore();
const postsStore = usePostsStore();
const usersStore = useUsersStore();

//prop
//TODO: it requires a slug but it actually isnt being used
const props = defineProps(["id", "slug"]);

//ref
const thread = ref<Thread>(await threadsStore.fetchThread(props.id).then());
const creator = ref<User>(await usersStore.fetchUser(thread.value.userId));

//computed
const threadPosts = computed(() => {
    return postsStore.posts.filter((post) => post.threadId === props.id);
});

/**
 * function to add a post to a thread
 * @param eventData the event
 */
//TODO look into eventData type. It is Event but .post doesnt exist in that type
const addPost = (eventData: any) => {
    const post: Post = {
        ...eventData.post,
        threadId: props.id
    };
    postsStore.createPost(post);
};
</script>

<template>
    <div class="col-large push-top">
        <h1>
            {{ thread?.title }}
            <!--Somehow this doesnt take params and just knows where to send you-->
            <router-link :to="{ name: 'ThreadEdit' }" class="btn-green btn-small" tag="button"
                >Edit Thread</router-link
            >
        </h1>
        <p>
            By <b>{{ creator.name }}</b
            ><a href="#" class="link-unstyled">{{}}</a>,
            <i>{{ diffForHumans(thread.publishedAt) }}.</i>
            <span style="float: right; margin-top: 2px" class="hide-mobile text-faded text-small"
                >{{ thread?.posts.length }} replies by
                {{ thread?.contributors.length }} contributor/s</span
            >
        </p>
        <PostListComponent :posts="threadPosts" />
        <PostEditorComponent @savePost="addPost" />
    </div>
</template>
