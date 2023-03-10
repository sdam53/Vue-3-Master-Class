import { doc, onSnapshot } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

/**
 * return a resource from firestore based on id and resource type
 * not a big fan of having to use any types
 * @param id the id
 * @param resource the resource type
 */
async function fetchItem(id: string, resource: string): Promise<any> {
    console.log(`Fetching ${resource}...`);
    let db = getFirestore();
    return new Promise((resolve) => {
        let docRef = doc(db, resource, id);
        onSnapshot(docRef, (doc) => {
            let docItem: any = doc.data();
            resolve({ ...docItem, id: doc.id });
        });
    });
}

/**
 * fetches multiple items from firestorm
 * @param ids list of ids
 * @param resource resource type
 */
const fetchItems = (ids: string[], resource: string) => {
    return Promise.all(ids.map((id) => fetchItem(id, resource)));
};

export { fetchItem, fetchItems };
