//pinia store to keep track of categories

import { fetchItem } from "@/middleware/db_helpers";
import { upsert } from "@/middleware/HelperFunctions";
import type Category from "@/types/Category";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

/**
 * category store
 */
export const useCategoriesStore = defineStore("CategoriesStore", () => {
    //store
    //const sourceDataStore = useSourceDataStore();

    //ref
    //const categories = ref(sourceDataStore.categories);
    const categories = ref<Category[]>([]);

    /**
     * adds a category into memory
     * @param category category object
     */
    const setCategory = (category: Category): void => {
        upsert(categories.value, category);
    };

    /**
     * fetches a category from firestom
     * @param categoryId the category id
     * @returns the category
     */
    async function fetchCategory(categoryId: string): Promise<Category> {
        let category = await fetchItem(categoryId, "categories");
        setCategory(category);
        return { ...category };
    }

    /**
     * gets all categories
     * @returns a list of all categories
     */
    async function fetchAllCategories(): Promise<Category[]> {
        let db = getFirestore();
        return new Promise((resolve) => {
            let colRef = collection(db, "categories");
            let categories: any[] = [];
            onSnapshot(colRef, (querySnapshot) => {
                categories = querySnapshot.docs.map((doc) => {
                    return { id: doc.id, ...doc.data() };
                });
                categories.forEach((category) => setCategory(category));
                resolve(categories);
            });
            //resolve(categories);
        });
    }

    /**
     * removes all categories from memory
     */
    function clearCategories() {
        categories.value = [];
    }

    return { categories, fetchCategory, fetchAllCategories, setCategory, clearCategories };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCategoriesStore, import.meta.hot));
}
