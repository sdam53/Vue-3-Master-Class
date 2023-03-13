//store mainly to handle subscriptions
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

/**
 * firebase store
 */
export const useFirebaseStore = defineStore("FirebaseStore", () => {
    //refs
    const unsubscriptions = ref([]);

    //adds new subscription
    const addUnsubscription = (sub: any) => {
        unsubscriptions.value.push(sub);
    };

    //clear all subscriptions
    const clearAllUnsubscriptions = () => {
        unsubscriptions.value = [];
    };

    //unsubscribe too all snapshots
    async function unsubscribeAllSnapshots() {
        unsubscriptions.value.forEach((unsub) => unsub());
        clearAllUnsubscriptions();
    }
    return { addUnsubscription, clearAllUnsubscriptions, unsubscribeAllSnapshots };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFirebaseStore, import.meta.hot));
}
