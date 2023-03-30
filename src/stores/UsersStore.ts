//pinia store to keep track of users

import { fetchItem, fetchItems } from "@/middleware/db_helpers";
import { findById, upsert } from "@/middleware/HelperFunctions";
import type User from "@/types/User";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, serverTimestamp, writeBatch } from "firebase/firestore";
import { getDownloadURL, getStorage, ref as fireRef, uploadBytes } from "firebase/storage";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { useToast } from "vue-toastification";

/**
 * user store
 */
export const useUsersStore = defineStore("UsersStore", () => {
    //toast
    const Toast = useToast();

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
        try {
            //adding user into auth and getting the id
            let auth = getAuth();
            let res = await createUserWithEmailAndPassword(auth, user.email, password);
            let id = res.user.uid;
            //if the new user added an image
            //save it to db and set the url for it
            user.avatar = await uploadAvatar(id, user.avatar as File | null);
            //adding to db
            let newUser = await registerUser(user, id);
            //i want the user to sign in when registering
            //let currentUserStore = useCurrentUserStore();
            //await currentUserStore.fetchAuthUser();
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    /**
     * uploads the users profile image and returns the image url
     * There are three main returns
     * 1. no avatar, thus user will recieve the default pic
     * 2. valid image file, thus user will get the valid image url
     * 3. invalid file/everything user will get null
     * @param id user id
     * @param avatar avatar File
     * @returns string or null of the image url
     */
    async function uploadAvatar(id: string, avatar: File | null): Promise<string | null> {
        if (!avatar)
            return `https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png`;
        try {
            const storageBucket = getStorage();
            const bucketRef = fireRef(
                storageBucket,
                `uploads/${id}/images/${Date.now()}-${avatar.name}`
            );
            const snapshot = await uploadBytes(bucketRef, avatar as unknown as Blob);
            return await getDownloadURL(snapshot.ref);
        } catch (error) {
            Toast.error("Invalid File", { timeout: 5000 });
        }
        return null;
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
            avatar: user.avatar,
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
        registerUser,
        uploadAvatar
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot));
}
