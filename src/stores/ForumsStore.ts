//pinia store to keep track of the forums

import { upsert } from "@/middleware/HelperFunctions";
import type Forum from "@/types/Forum";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { fetchItem, fetchItems } from "@/middleware/db_helpers";

/**
 * forums store
 */
export const useForumsStore = defineStore("ForumsStore", () => {
    //store
    //const sourceDataStore = useSourceDataStore();

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
     * fetches a forum form firestorm
     * @param forumId the forum id
     */
    async function fetchForum(forumId: string): Promise<Forum> {
        let forum = await fetchItem(forumId, "forums");
        setForum(forum);
        return { ...forum };
    }

    /**
     * fetches forums from firestore
     * @param forumIds list of forum ids
     */
    async function fetchForums(forumIds: string[]): Promise<Forum[]> {
        let forums: Forum[] = await fetchItems(forumIds, "forums");
        forums.forEach((forum) => setForum(forum));
        return forums;
    }

    return { forums, setForum, fetchForum, fetchForums };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useForumsStore, import.meta.hot));
}
