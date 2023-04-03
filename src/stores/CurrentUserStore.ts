//pinia store to keep track of the current user

import { fetchItem } from "@/middleware/db_helpers";
import { findById } from "@/middleware/HelperFunctions";
import type Post from "@/types/Post";
import type Thread from "@/types/Thread";
import type User from "@/types/User";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from "@firebase/auth";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    updateDoc,
    where
} from "@firebase/firestore";
import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";
import { usePostsStore } from "./PostsStore";
import { useThreadsStore } from "./ThreadsStore";
import { useUsersStore } from "./UsersStore";

/**
 * current user store
 */
export const useCurrentUserStore = defineStore("CurrentUserStore", () => {
    //stores
    const postStore = usePostsStore();
    const threadStore = useThreadsStore();
    const userStore = useUsersStore();

    //ref
    const authId = ref<string | null>(null);
    const authUserUnsubscribe = ref<(() => void) | null>(null);
    const authObserverUnsubscribe = ref<(() => void) | null>(null);

    //computed data
    const authUser = computed<User | null>(() =>
        authId.value ? (findById(userStore.users, authId.value) as User) : null
    );
    const email = computed(() => authUser.value?.email);
    const name = computed(() => authUser.value?.name);
    const avatar = computed(() => authUser.value?.avatar);
    const username = computed(() => authUser.value?.username);
    const bio = computed(() => authUser.value?.bio);
    const website = computed(() => authUser.value?.website);
    const isSignedIn = computed(() => {
        return authId.value != null && authId.value != "";
    });
    const posts = computed(() => {
        return postStore.posts.filter((post: Post) => post.userId === authId.value) || [];
    });
    const postsCount = computed(() => {
        //return isSignedIn.value ? authUser.value.postsCount : 0;
        return posts.value.length;
    });
    const threads = computed(() => {
        return isSignedIn.value
            ? threadStore.threads.filter((thread: Thread) => thread.userId === authId.value)
            : [];
    });
    const threadIds = computed(() => authUser.value?.threads || []);
    const threadsCount = computed(() => (isSignedIn.value ? threadIds.value?.length || 0 : 0));

    /**
     * Updates the user to firesotre
     * @param user user object with the updates
     */
    const updateUser = async (user: User) => {
        if (!isSignedIn.value) return;
        const updated = {
            avatar: user.avatar || null,
            username: user.username || null,
            name: user.name || null,
            bio: user.bio || null,
            website: user.website || null,
            email: user.email || null,
            location: user.location || null
        };
        userStore.setUser(updated as User);
        const db = getFirestore();
        //TODO: Errors but this works and should be the correct way to do it
        let userRef = doc(db, "users", authId.value);
        await updateDoc(userRef, updated);
    };

    /**
     * set the users auth id
     * @param id auth id
     */
    const setAuthId = (id: string | null) => {
        authId.value = id;
    };

    /**
     * fetches the currently signed in user's auth id
     */
    async function fetchAuthUser() {
        let userId = getAuth().currentUser?.uid;
        if (!userId) return;
        setAuthId(userId);
        if (!authId.value) return;
        let user = await fetchItem(userId, "users", { handleUnsubscribe: setAuthUserUnsubscribe });
        userStore.setUser({ ...user });
    }

    /**
     * sign in the user using email and password
     * @param email user email
     * @param password user password
     */
    async function signInWithEmailAndPass(email: string, password: string) {
        let auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password);
        /*//actually dont need these bottom pieces since we have an observer in the main page
            .then((userCredentials) => {

            })
            .catch((error) => {
                throw error;
            });
            */
    }

    /**
     * registers a user through google auth
     */
    async function signInWithGoogle() {
        //setting up google auth
        let provider = new GoogleAuthProvider();
        let auth = getAuth();
        //signing up using pop up
        let res = await signInWithPopup(auth, provider);
        let user = res.user;
        //getting the user from firestore
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        //if this user isnt in the data base then we add them
        //else we just update the user, which is done by a listener
        if (!userDoc.exists()) {
            let newUser: User = {
                avatar: user.photoURL,
                email: user.email,
                name: user.displayName,
                username: user.email
            } as User;
            return userStore.registerUser(newUser, user.uid);
        }
    }

    /**
     * function to log out the user
     */
    async function logout() {
        let auth = getAuth();
        await signOut(auth);
        setAuthId(null);
    }

    /**
     * unsub auth user
     * @param unsubscribe unsub function
     */
    const setAuthUserUnsubscribe = (unsubscribe: (() => void) | null) => {
        authUserUnsubscribe.value = unsubscribe;
    };

    /**
     * setting the unsub funtion
     * @param unsubscribe the unsub function
     */
    const setAuthObserverUnsubscribe = (unsubscribe: (() => void) | null) => {
        authObserverUnsubscribe.value = unsubscribe;
    };

    /**
     * unsub to currently signed in user's snapshot
     */
    async function unsubscribeAuthUserSnapshot() {
        if (authUserUnsubscribe.value) {
            authUserUnsubscribe.value();
            setAuthUserUnsubscribe(null);
        }
    }

    /**
     * initiates the user authentification observer
     */
    async function initAuthentication(): Promise<User | null> {
        //subs the user auth
        if (authObserverUnsubscribe.value) {
            authObserverUnsubscribe.value();
        }
        return new Promise((resolve) => {
            //allows for logins to persist even after browser refreshes
            const unsub = getAuth().onAuthStateChanged(async (user) => {
                //unsubs the user
                unsubscribeAuthUserSnapshot();
                if (user) {
                    //resolves the user
                    await fetchAuthUser();
                    resolve(user as unknown as User); //does this work?
                } else {
                    resolve(null);
                }
            });
            setAuthObserverUnsubscribe(unsub);
        });
    }

    /**
     * fetches the user threads from firestore and stores it in memory
     * does not save snapshots
     */
    async function fetchAuthUserThreads() {
        if (!isSignedIn.value) return;
        const db = getFirestore();
        const threadRef = collection(db, "threads");
        const q = query(threadRef, where("userId", "==", authId.value));
        const threads = await getDocs(q);
        threads.forEach((thread) => threadStore.setThread(thread.data() as Thread));
    }

    return {
        //ref
        authId,
        authUserUnsubscribe,
        //computed
        authUser,
        isSignedIn,
        email,
        name,
        avatar,
        username,
        bio,
        website,
        posts,
        postsCount,
        threads,
        threadIds,
        threadsCount,
        //functions
        updateUser,
        fetchAuthUser,
        signInWithEmailAndPass,
        signInWithGoogle,
        logout,
        setAuthId,
        setAuthUserUnsubscribe,
        unsubscribeAuthUserSnapshot,
        initAuthentication,
        fetchAuthUserThreads
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCurrentUserStore, import.meta.hot));
}
