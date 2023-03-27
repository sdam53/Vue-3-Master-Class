<script setup lang="ts">
//page to show list of threads in a forum. Basically child of category and parent of threads
import ThreadList from "@/components/ThreadListComponent.vue";
import { defineProps, computed, ref, watch } from "vue";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { useForumsStore } from "@/stores/ForumsStore";
import { findById } from "@/middleware/HelperFunctions";
import type Forum from "@/types/Forum";
import { useUsersStore } from "@/stores/UsersStore";
import { useAsyncState } from "@vueuse/core";
import type Thread from "@/types/Thread";
import _ from "lodash";
import { useRoute, useRouter } from "vue-router";
import ForumListComponent from "@/components/ForumListComponent.vue";

//router stuff
const route = useRoute();
const router = useRouter();

//emits
const emits = defineEmits(["ready", "notReady"]);

//stores
const threadsStore = useThreadsStore();
const forumsStore = useForumsStore();
const usersStore = useUsersStore();

//props
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

//computed data
const threads = computed<Thread[]>(() => {
    if (!forum.value) return [];
    return threadsStore.threads.filter((thread) => thread.forumId === props.id) as Thread[];
});
const forum = computed<Forum>(() => {
    return findById(forumsStore.forums, props.id) as Forum;
});

//things needed for pagination
const pageNumber = ref<number>(route.query.page ? parseInt(route.query.page.toString()) : 1);
const threadsPerPage = ref(5);
const totalVisiblePageButtons = ref(7);
const totalNumberOfThreads = computed(() => forum.value.threads.length || 0);
const totalNumberOfPages = computed(() =>
    totalNumberOfThreads.value ? Math.ceil(totalNumberOfThreads.value / threadsPerPage.value) : 0
);
const firstPage = () => {
    pageNumber.value = 1;
};
const lastPage = () => {
    pageNumber.value = totalNumberOfPages.value;
};
const nextPage = () => {
    pageNumber.value =
        pageNumber.value + 1 <= totalNumberOfPages.value ? pageNumber.value + 1 : pageNumber.value;
};
const prevPage = () => {
    pageNumber.value = pageNumber.value - 1 >= 1 ? pageNumber.value - 1 : pageNumber.value;
};
const changePage = (e: number) => {
    pageNumber.value = e >= 0 && e <= totalNumberOfPages.value ? e : pageNumber.value;
};

/**
 * watch for a page change to fetch more threads
 * can also do it in @update:modelValue="changePage"
 * but this is more preferable
 */
watch(pageNumber, async (newValue, oldValue) => {
    router.push({
        name: "Forum",
        params: { id: forum.value.id, slug: forum.value.slug },
        query: { page: pageNumber.value as number }
    });
});

const { isReady } = useAsyncState(async () => {
    //fetch the forum
    let forum: Forum = await forumsStore.fetchForum(props.id);
    //checks if user has a valid page number
    if (
        Number.isNaN(+pageNumber.value) ||
        pageNumber.value <= 0 ||
        pageNumber.value > totalNumberOfPages.value
    )
        router.push({ name: "Forum", params: { id: forum.id, slug: forum.slug } });

    //checks if the slug is there and correct, else redirect to fix the url
    if (props.slug !== forum.slug) {
        router.push({ name: "Forum", params: { id: forum.id, slug: forum.slug } });
    } else {
        await threadsStore.fetchThreadsByPage(
            forum.threads,
            pageNumber.value,
            threadsPerPage.value
        );
        usersStore.fetchUsers(threads.value.map((thread) => thread.userId));
        document.title = forum.name;
        emits("ready");
    }
}, undefined);
</script>

<template>
    <div v-if="isReady" class="col-full push-top">
        <div class="forum-header">
            <div class="forum-details">
                <h1>{{ forum?.name }}</h1>
                <p class="text-lead">{{ forum?.description }}</p>
            </div>
            <router-link
                :to="{ name: 'ThreadCreate', params: { forumId: forum?.id } }"
                class="btn-green btn-small"
                >Start a thread</router-link
            >
        </div>
    </div>

    <div v-if="isReady" class="col-full push-top">
        <ThreadList :threads="threads" />
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
            @first="firstPage"
            @last="lastPage"
            @next="nextPage"
            @prev="prevPage"
            @update:modelValue="changePage"
        ></v-pagination>
    </div>
</template>

<style lang="scss">
$pagination-item-margin: 500px;
</style>
