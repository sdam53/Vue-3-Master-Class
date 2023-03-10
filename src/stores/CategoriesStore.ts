//pinia store to keep track of categories

import type Category from "@/types/Category";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { useSourceDataStore } from "./SourceDataStore";
import { collection, doc, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { upsert } from "@/middleware/HelperFunctions";
import { fetchItem } from "@/middleware/db_helpers";

/**
 * category store
 */
export const useCategoriesStore = defineStore("CategoriesStore", () => {
    //store
    const sourceDataStore = useSourceDataStore();

    //ref
    //const categories = ref(sourceDataStore.categories);
    const categories = ref<Category[]>([]);

    /**
     * adds a category into memory
     * @param category category object
     */
    const setCategory = (category: Category) => {
        upsert(categories.value, category);
    };

    /**
     * fetches a category from firestom
     * @param categoryId the category id
     */
    async function fetchCategory(categoryId: string): Promise<Category> {
        let category = await fetchItem(categoryId, "categories");
        setCategory(category);
        return { ...category };
    }

    /**
     * gets all categories
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

    return { categories, fetchCategory, fetchAllCategories };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCategoriesStore, import.meta.hot));
}
