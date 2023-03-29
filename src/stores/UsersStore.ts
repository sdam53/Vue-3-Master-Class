//pinia store to keep track of users

import { fetchItem, fetchItems } from "@/middleware/db_helpers";
import { findById, upsert } from "@/middleware/HelperFunctions";
import type User from "@/types/User";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, serverTimestamp, writeBatch } from "firebase/firestore";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

/**
 * user store
 */
export const useUsersStore = defineStore("UsersStore", () => {
    //ref
    const users = ref<User[]>([]);

    //function to get specific user
    /**
     * returns a user
     * @param userId user id
     * @returns the user
     */
    const getUser = (userId: string | null): User | null => {
        return userId ? (findById(users.value, userId) as User) : null;
    };

    /**
     * saves a user into memory
     * @param user the user
     */
    const setUser = (user: User) => {
        //const userIndex = userStore.users.findIndex((user: User) => user.id === userId);
        //userStore.users[userIndex] = { ...user };
        upsert(users.value, { ...user });
    };

    /**
     * fetches a user from firestorm and saves into memory
     * @param userId the userid
     * @returns the user
     */
    async function fetchUser(userId: string): Promise<User> {
        let user = await fetchItem(userId, "users");
        setUser({ ...user });
        return { ...user };
    }

    /**
     * fetches multiple users from firestorm
     * @param userIds list ofuserids
     * @returns list of users
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
     * @returns the new registered user
     */
    async function registerUserWithEmailPassword(user: User, password: string): Promise<User> {
        //adding user into auth and getting the id
        let auth = getAuth();
        let res = await createUserWithEmailAndPassword(auth, user.email, password);
        let id = res.user.uid;
        //adding to db
        let newUser = await registerUser(user, id);
        //i want the user to sign in when registering
        //let currentUserStore = useCurrentUserStore();
        //await currentUserStore.fetchAuthUser();
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

    return {
        users,
        getUser,
        fetchUser,
        fetchUsers,
        setUser,
        registerUserWithEmailPassword,
        registerUser
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot));
}
