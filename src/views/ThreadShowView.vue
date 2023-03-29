<script async setup lang="ts">
//page that shows a individual thread and its posts

import PostEditorComponent from "@/components/PostEditorComponent.vue";
import PostListComponent from "@/components/PostListComponent.vue";
import { diffForHumans, findById } from "@/middleware/HelperFunctions";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import { usePostsStore } from "@/stores/PostsStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { useUAStore } from "@/stores/UAStore";
import { useUsersStore } from "@/stores/UsersStore";
import type Post from "@/types/Post";
import type Thread from "@/types/Thread";
import type User from "@/types/User";
import { useAsyncState } from "@vueuse/core";
import { difference } from "lodash";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

//stores
const threadsStore = useThreadsStore();
const postsStore = usePostsStore();
const usersStore = useUsersStore();
const currentUserStore = useCurrentUserStore();
const UAStore = useUAStore();

//router stuff
const route = useRoute();
const router = useRouter();

//toast stuff
const toast = useToast();

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

//computed
const thread = computed<Thread>(() => findById(threadsStore.threads, props.id) as Thread);
const threadPosts = computed<Post[]>(() => {
    return postsStore.posts.filter((post: Post) => post.threadId === props.id);
});
const creator = computed<User>(() => usersStore.getUser(thread.value?.userId) as User);
const isSignedIn = computed(() => currentUserStore.isSignedIn);
const isCreator = computed(() => isSignedIn.value && currentUserStore.authId === creator.value?.id);

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

//pagination stuff
const pageNumber = ref<number>(route.query.page ? parseInt(route.query.page.toString()) : 1);
const postsPerPage = ref(10);
const totalVisiblePageButtons = ref(UAStore.isMobile ? 1 : 5);
const totalNumberOfPosts = computed(() => thread.value.posts.length || 0);
const totalNumberOfPages = computed(() => Math.ceil(totalNumberOfPosts.value / postsPerPage.value));
const changePage = (e: number) => {
    pageNumber.value = e >= 0 && e <= totalNumberOfPages.value ? e : pageNumber.value;
};
const isLastPage = computed(() => pageNumber.value === totalNumberOfPages.value);

/**
 * watch for a page change to fetch more posts
 * can also do it in @update:modelValue="changePage"
 * but this is more preferable
 */
watch(pageNumber, async (newValue, oldValue) => {
    router.push({
        name: "ThreadShow",
        params: { id: thread.value.id, slug: thread.value.slug },
        query: { page: pageNumber.value as number }
    });
});

const { isReady } = useAsyncState(async () => {
    //fetches all posts and user in a thread and saves it to memory
    let thread = await threadsStore.fetchThread(props.id, {
        onSnapshot: async ({ item, prevItem }) => {
            //getting the new posts
            const newPosts = difference(item.posts, prevItem.posts) as string[];
            if (newPosts.length > 0) {
                //fetching the new posts information and users
                //let posts = await threadsStore.fetchThreads(newPosts);
                let posts = await postsStore.fetchPosts(newPosts);
                await usersStore.fetchUsers(posts.map((post) => post.userId));
                //if user didnt make a new post then have the user get a notification
                const containsUser = posts.find((post) => post.userId === currentUserStore.authId);
                if (!containsUser) toast("Thread updated");
            }
        }
        //once: true
    });
    //webpage validating
    isOnValidPage(thread);

    //fetching posts and users
    //adding a callback for post edits
    //the toast will only work when the post is on the same page due to
    //clearing out snapshots when switching pages
    const posts = await postsStore.fetchPostsByPage(
        thread.posts,
        pageNumber.value,
        postsPerPage.value,
        {
            onSnapshot: ({ prevItem }) => {
                if (!isReady.value || (prevItem && prevItem.edited && !prevItem?.edited?.at))
                    return;
                //if the user didnt update a post then get a notification
                if (prevItem.userId !== currentUserStore.authId)
                    toast("A post was recently updated");
            }
        }
    );
    let users = posts.map((post: Post) => post.userId);
    usersStore.fetchUsers(users);
    usersStore.fetchUser(thread.userId);
    document.title = thread.title;
    emits("ready");
}, undefined);

/**
 * Validates that the thread has valid data ie page number and slug
 * if not then it redirects to a correct version
 * @param thread
 */
const isOnValidPage = (thread: Thread) => {
    //checks if user has a valid page number
    if (
        Number.isNaN(+pageNumber.value) ||
        pageNumber.value <= 0 ||
        pageNumber.value > totalNumberOfPages.value
    ) {
        router.push({ name: "ThreadShow", params: { id: thread.id, slug: thread.slug } });
    }
    //updates the slug if the user used an incorrect one by redirecting
    if (props.slug !== thread.slug) {
        router.push({ name: "ThreadShow", params: { id: thread.id, slug: thread.slug } });
    }
};
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
        <!--pagination-->
        <v-pagination
            :length="totalNumberOfPages"
            :totalVisible="totalVisiblePageButtons"
            rounded="circle"
            :disabled="false"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            elevation="0"
            :showFirstLastPage="true"
            :modelValue="pageNumber"
            active-color="#57AD8D"
            @update:modelValue="changePage"
            style="margin-bottom: 20px; margin-top: 20px"
        ></v-pagination>
        <!--Post editor for adding more posts/login and register-->
        <PostEditorComponent v-if="isSignedIn && isLastPage" @savePost="addPost" />
        <div
            v-else-if="!isSignedIn"
            class="text-center"
            style="margin-bottom: 50px; margin-top: 20px"
        >
            <router-link :to="{ name: 'Login', query: { redirectTo: $route.fullPath } }"
                >Sign In</router-link
            >
            or
            <router-link :to="{ name: 'Register', query: { redirectTo: $route.fullPath } }"
                >Register</router-link
            >
            to reply.
        </div>
    </div>
</template>
