import { doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { setItem } from "@/middleware/HelperFunctions";

/**
 * return a resource from firestore based on id and resource type
 * not a big fan of having to use any types
 * @param id the id
 * @param resource the resource type
 * @param handleUnsubscribe function to handle special cases. defaults to null
 * @returns Promise<any> these will contain null items
 */
async function fetchItem(
    id: string,
    resource: string,
    handleUnsubscribe: ((sub: any) => void) | null = null
): Promise<any> {
    //console.log(`Fetching ${resource}...`);
    let firebaseStore = useFirebaseStore();
    let db = getFirestore();
    return new Promise((resolve) => {
        let docRef = doc(db, resource, id);
        let unsubscribe: () => void = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                let docItem: any = doc.data();
                setItem({ ...docItem, id: doc.id }, resource);
                resolve({ ...docItem, id: doc.id });
            } else {
                resolve(null);
            }
        });

        if (handleUnsubscribe) {
            handleUnsubscribe(unsubscribe);
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

export { fetchItem, fetchItems };
