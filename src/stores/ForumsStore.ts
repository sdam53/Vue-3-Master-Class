//pinia store to keep track of the forums

import { fetchItem, fetchItems } from "@/middleware/db_helpers";
import { upsert } from "@/middleware/HelperFunctions";
import type Forum from "@/types/Forum";
import chunk from "lodash/chunk";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

/**
 * forums store
 */
export const useForumsStore = defineStore("ForumsStore", () => {
    //ref
    //const forums = ref(sourceDataStore.forums);
    const forums = ref<Forum[]>([]);

    /**
     * saves the forum into memory
     * @param forum the forum
     */
    const setForum = (forum: Forum) => {
        upsert(forums.value, { ...forum });
    };

    /**
     * fetches a forum from firestorm
     * @param forumId the forum id
     * @returns forum obj
     */
    async function fetchForum(forumId: string): Promise<Forum> {
        const forum = await fetchItem(forumId, "forums");
        setForum(forum);
        return { ...forum };
    }

    /**
     * fetches forums from firestore
     * @param forumIds list of forum ids
     * @returns list of forums
     */
    async function fetchForums(forumIds: string[]): Promise<Forum[]> {
        const forums: Forum[] = await fetchItems(forumIds, "forums");
        forums.forEach((forum) => setForum(forum));
        return forums;
    }

    /**
     * fetches forums by page number
     * Another way to do it is to have firestore deal with pagination instead of using lodash
     * @param forumIds the threadsids
     * @param pageNumber the page number
     * @param perPage how many forums per page default 10
     * @returns Thread[] list of the threads in that page
     */
    async function fetchForumsByPage(
        forumIds: string[],
        pageNumber: number,
        perPage: number = 10
    ): Promise<Forum[]> {
        clearForums();
        const threads = chunk(forumIds, perPage);
        const limitedIds = threads[pageNumber - 1];
        return fetchForums(limitedIds);
    }

    /**
     * clears all cached forums
     */
    function clearForums() {
        forums.value = [];
    }

    return { forums, setForum, fetchForum, fetchForums, fetchForumsByPage, clearForums };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useForumsStore, import.meta.hot));
}
