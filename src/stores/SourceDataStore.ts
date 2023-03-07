//pinia store to contain all data
//every other store will retrieve from this store to initialize

import { defineStore, acceptHMRUpdate } from "pinia";
import { reactive } from "vue";
import sourceData from "@/data.json";
import type Category from "@/types/Category";
import type Forum from "@/types/Forum";
import type Post from "@/types/Post";
import type Stats from "@/types/Stats";
import type Thread from "@/types/Thread";
import type User from "@/types/User";

/**
 * source data store
 */
export const useSourceDataStore = defineStore("SourceDataStore", () => {
    const data: any = reactive(sourceData); //would prefer type SourceData but get some errors TODO
    const categories: Category[] = reactive(data.categories);
    const forums: Forum[] = reactive(data.forums);
    const posts: Post[] = reactive(data.posts);
    const stats: Stats = reactive(data.stats);
    const threads: Thread[] = reactive(data.threads);
    const users: User[] = reactive(data.users);

    return { categories, forums, posts, stats, threads, users };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSourceDataStore, import.meta.hot));
}
