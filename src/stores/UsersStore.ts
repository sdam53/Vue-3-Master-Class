//pinia store to keep track of users

import { findById } from "@/middleware/HelperFunctions";
import type Post from "@/types/Post";
import type User from "@/types/User";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { usePostsStore } from "./PostsStore";
import { useSourceDataStore } from "./SourceDataStore";

/**
 * user store
 */
export const useUsersStore = defineStore("UsersStore", () => {
    //store
    const sourceDataStore = useSourceDataStore();
    const postStore = usePostsStore();

    //ref
    const users = ref(sourceDataStore.users);
    //const users = ref<User[]>([]);

    //function to get specific user
    const getUser = (userId: string): User | null => {
        return findById(users.value, userId);
    };

    async function fetchUser(userId: string): Promise<User> {
        console.log("Fetching user");
        let db = getFirestore();
        return new Promise((resolve) => {
            let docRef = doc(db, "users", userId);
            onSnapshot(docRef, (doc) => {
                let docItem = doc.data();
                let user: User = {
                    avatar: docItem?.avatar,
                    email: docItem?.email,
                    lastVisitAt: docItem?.lastVisitAt,
                    name: docItem?.name,
                    isModerator: docItem?.isModerator,
                    registeredAt: docItem?.registeredAt,
                    username: docItem?.username,
                    usernameLower: docItem?.usernameLower,
                    id: doc.id
                };
                //let user: User = { ...doc.data(), id: doc.id }; //would be ideal but error
                //look into this later
                //setUser(user)
                resolve(user);
            });
        });
    }

    return { users, getUser, fetchUser };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot));
}
