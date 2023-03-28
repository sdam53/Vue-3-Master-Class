import { doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { setItem } from "@/middleware/HelperFunctions";

/**
 * Type declaration for fetchItem's options
 */
type FetchItemOptionsType = {
    handleUnsubscribe?: (fun: any) => void; //function to handle special cases. defaults to null
    once?: boolean; //whether to have the listener keep running or remove it once item is retrieved
};

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
    let firebaseStore = useFirebaseStore();
    let db = getFirestore();
    return new Promise((resolve) => {
        let docRef = doc(db, resource, id);
        let unsubscribe: () => void = onSnapshot(docRef, (doc) => {
            if (options && options.once) unsubscribe();
            if (doc.exists()) {
                let docItem: any = doc.data();
                setItem({ ...docItem, id: doc.id }, resource);
                resolve({ ...docItem, id: doc.id });
            } else {
                resolve(null);
            }
        });
        if (options && options.handleUnsubscribe) {
            options.handleUnsubscribe(unsubscribe);
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
const fetchItems = (ids: string[], resource: string) => {
    console.log(`Fetching multiple ${resource}...`);
    return Promise.all(ids.map((id) => fetchItem(id, resource)));
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

export { fetchItem, fetchItems };
