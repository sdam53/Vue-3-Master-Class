//pinia store to keep track of users

import { fetchItem, fetchItems } from "@/middleware/db_helpers";
import { findById, upsert } from "@/middleware/HelperFunctions";
import type Post from "@/types/Post";
import type User from "@/types/User";
import {
    getFirestore,
    doc,
    onSnapshot,
    getDoc,
    serverTimestamp,
    writeBatch,
    collection
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { usePostsStore } from "./PostsStore";
import { useSourceDataStore } from "./SourceDataStore";
import { useCurrentUserStore } from "./CurrentUserStore";

/**
 * user store
 */
export const useUsersStore = defineStore("UsersStore", () => {
    //store
    const sourceDataStore = useSourceDataStore();
    const postStore = usePostsStore();

    //ref
    //const users = ref(sourceDataStore.users);
    const users = ref<User[]>([]);

    //function to get specific user
    const getUser = (userId: string): User | null => {
        return findById(users.value, userId);
    };

    //function to set the user
    const setUser = (user: User) => {
        //const userIndex = userStore.users.findIndex((user: User) => user.id === userId);
        //userStore.users[userIndex] = { ...user };
        upsert(users.value, { ...user });
    };

    /**
     * fetches a user from firestorm
     * @param userId the userid
     */
    async function fetchUser(userId: string): Promise<User> {
        let user = await fetchItem(userId, "users");
        setUser({ ...user });
        return { ...user };
    }

    /**
     * fetches multiple users from firestorm
     * @param userIds list ofuserids
     */
    async function fetchUsers(userIds: string[]): Promise<User[]> {
        let users: User[] = await fetchItems(userIds, "users");
        users.forEach((user) => setUser(user));
        return users;
    }

    /**
     * registers a user into google auth and return their id
     * @param email user email
     * @param password user password
     * @returns id the id of the registered user
     */
    async function registerUserWithEmailPassword(user: User, password: string): Promise<User> {
        //adding user into auth and getting the id
        let auth = getAuth();
        let res = await createUserWithEmailAndPassword(auth, user.email, password);
        let id = res.user.uid;
        //adding to db
        let newUser = await registerUser(user, id);
        let currentUserStore = useCurrentUserStore();
        await currentUserStore.fetchAuthUser();
        return newUser;
    }

    /**
     * registers a new user to the db
     * @param user user info
     * @param password user password //seperate due to User type not allowing password
     * @returns user obj
     */
    async function registerUser(user: User, id: string): Promise<User> {
        //adding user into firestore
        //getting db and new user ref
        let db = getFirestore();
        let userRef = doc(db, "users", id);
        //setting up the new user
        let registeredAt = serverTimestamp();
        let theUser: User = {
            avatar:
                user.avatar ||
                `https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png`,
            email: user.email.toLowerCase(),
            lastVisitAt: registeredAt,
            name: user.name,
            isModerator: false,
            registeredAt: registeredAt,
            username: user.username,
            usernameLower: user.username.toLowerCase()
        };
        //adding user to firestore
        let batch = writeBatch(db);
        batch.set(userRef, theUser);
        await batch.commit();
        //getting user from firestore
        let newUser = await fetchItem(userRef.id, "users");
        setUser(newUser as User);
        return newUser as User;
    }

    return { users, getUser, fetchUser, fetchUsers, setUser, registerUserWithEmailPassword };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot));
}
