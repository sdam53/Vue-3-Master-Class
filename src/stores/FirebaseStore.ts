//store mainly to handle subscriptions
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

/**
 * firebase store
 */
export const useFirebaseStore = defineStore("FirebaseStore", () => {
    //refs
    const unsubscriptions = ref<(() => void)[]>([]);

    /**
     * adds a new subscription
     * @param sub unsub function
     */
    const addUnsubscription = (sub: () => void) => {
        //type never
        //https://www.tutorialsteacher.com/typescript/typescript-never
        unsubscriptions.value.push(sub);
    };

    //clears all subscriptions
    const clearAllUnsubscriptions = () => {
        unsubscriptions.value = [];
    };

    //unsubscribe too all snapshots
    async function unsubscribeAllSnapshots() {
        unsubscriptions.value.forEach((unsub: () => void) => unsub()); //function type expression as the type
        clearAllUnsubscriptions();
    }

    return {
        addUnsubscription,
        clearAllUnsubscriptions,
        unsubscribeAllSnapshots
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFirebaseStore, import.meta.hot));
}
