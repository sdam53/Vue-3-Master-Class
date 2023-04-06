import { findById, setItem } from "@/middleware/HelperFunctions";
import { useCategoriesStore } from "@/stores/CategoriesStore";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { useForumsStore } from "@/stores/ForumsStore";
import { usePostsStore } from "@/stores/PostsStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { useUsersStore } from "@/stores/UsersStore";
import type FetchItemOptionsType from "@/types/FetchItemOptionsType";
import {
    collection,
    doc,
    getDocs,
    getFirestore,
    onSnapshot,
    query,
    where
} from "firebase/firestore";

/**
 * return a resource from firestore based on id and resource type
 * not a big fan of having to use any types but better than writing everything out i guess
 * @param id the resource id
 * @param resource the resource type
 * @param options refer to FetchItemOptionsType
 * @returns Promise<any> array of items. these will contain null items
 */ //function doStuff(options: { unsub?: () => void; once?: boolean }) {}
async function fetchItem(
    id: string,
    resource: string,
    options: FetchItemOptionsType | null = null
): Promise<any> {
    //console.log(`Fetching ${resource}...`);
    const firebaseStore = useFirebaseStore();
    const db = getFirestore();
    return new Promise((resolve) => {
        const docRef = doc(db, resource, id);
        const unsubscribe: () => void = onSnapshot(docRef, (doc) => {
            if (options && options.once) unsubscribe();
            if (doc.exists()) {
                const docItem: any = doc.data();
                //copy of item obj
                const item = { ...docItem, id: doc.id };
                //if onSnapshot function exists
                if (options && options.onSnapshot && typeof options.onSnapshot === "function") {
                    //previous item
                    let prevItem = findById(getResourceList(resource), doc.id);
                    prevItem = prevItem ? { ...prevItem } : null;
                    options.onSnapshot({ item: { ...item }, prevItem: { ...prevItem } });
                }
                //setting and returning item
                setItem({ ...item }, resource);
                resolve({ ...item });
            } else {
                resolve(null);
            }
        });
        //if handleUnsub function exists
        if (options && options.handleUnsubscribe) {
            // options.handleUnsubscribe(unsubscribe);
        } else {
            firebaseStore.addUnsubscription(unsubscribe);
        }
    });
}

/**
 * fetches multiple items from firestorm
 * @param ids list of ids
 * @param resource resource type
 * @returns Promise<any>[] these will contain null items
 */
const fetchItems = (
    ids: string[],
    resource: string,
    options: FetchItemOptionsType | null = null
) => {
    console.log(`Fetching multiple ${resource}...`);
    return Promise.all(ids.map((id) => fetchItem(id, resource, options)));
};

const getResourceList = (resource: string): any[] => {
    const threadsStore = useThreadsStore();
    const forumsStore = useForumsStore();
    const usersStore = useUsersStore();
    const postsStore = usePostsStore();
    const categoriesStore = useCategoriesStore();
    switch (resource) {
        case "users":
            return usersStore.users;
        case "posts":
            return postsStore.posts;
        case "threads":
            return threadsStore.threads;
        case "forums":
            return forumsStore.forums;
        case "categories":
            return categoriesStore.categories;
    }

    return [];
};

/**
 * checks if a email already exists
 * @param email the email to check
 * @returns boolean whether email already exists
 */
const emailExist = async (email: string): Promise<Boolean> => {
    const db = getFirestore();
    const q = query(collection(db, "users"), where("email", "==", email));
    const data = await getDocs(q);
    return data.size > 0;
};

/**
 * checks if a username already exists
 * @param username the username to check
 * @returns boolean whether username already exists
 */
const userNameExist = async (username: string): Promise<Boolean> => {
    if (!username || username === "") return false;
    const db = getFirestore();
    const q = query(collection(db, "users"), where("username", "==", username));
    const data = await getDocs(q);
    return data.size > 0;
};

/**
 * course makes these functions, but im chosing not to
 * section 16-1
 * TODO: TBH I dont really get why its done that way and how to make that work for me
 * https://github.com/vueschool/vue-masterclass/commit/3283e6211f2177ee4bf236ae2f03f1317a57c8c4
 * This is the src for this commit
 * @param resource
 */
/*
const makeFetchItemAction = (resource) => {
}
const makeFetchItemsAction = (resources) => {};
*/

export { fetchItem, fetchItems, emailExist, userNameExist };
