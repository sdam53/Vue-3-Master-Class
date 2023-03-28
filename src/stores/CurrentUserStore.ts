//pinia store to keep track of the current user

import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";
import type Post from "@/types/Post";
import type Thread from "@/types/Thread";
import type User from "@/types/User";
import { usePostsStore } from "./PostsStore";
import { useThreadsStore } from "./ThreadsStore";
import { useUsersStore } from "./UsersStore";
import { findById } from "@/middleware/HelperFunctions";
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
    where,
    orderBy,
    limit,
    startAfter
} from "@firebase/firestore";
import { fetchItem } from "@/middleware/db_helpers";

/**
 * current user store
 */
export const useCurrentUserStore = defineStore("CurrentUserStore", () => {
    //stores
    const postStore = usePostsStore();
    const threadStore = useThreadsStore();
    const userStore = useUsersStore();

    //ref
    //const authId = ref("VXjpr2WHa8Ux4Bnggym8QFLdv5C3");3b2x1vGujmAe79ngvktc;HiPWtTRCQUGo377B18MS
    //const authId = ref<string | null>("HiPWtTRCQUGo377B18MS");
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
    const threadsCount = computed(() => (isSignedIn.value ? threads.value.length || 0 : 0));

    /**
     * Updates the user to firesotre
     * @param user user object with the updates
     */
    const updateUser = async (user: User) => {
        if (!isSignedIn.value) return;
        const updates = {
            avatar: user.avatar || null,
            username: user.username || null,
            name: user.name || null,
            bio: user.bio || null,
            website: user.website || null,
            email: user.email || null,
            location: user.location || null
        };
        userStore.setUser(updates as User);

        const db = getFirestore();
        //TODO: Errors but this works and should be the correct way to do it
        let userRef = doc(db, "users", authId.value);
        await updateDoc(userRef, updates);
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
        //TODO: Pinia in console doesnt have this ref for some reason
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
     * fetches the user posts from firestore and stores it in memory
     * does not save snapshots
     * @options the options param obj for pagnation fetching
     * if it is null then just get the recents
     * if options.startAfter is not null then startAfter method is used
     * @returns count boolean of whether there are more that 0 posts or not
     * Is used for infinite loading
     */
    async function fetchAuthUserPosts(options: any | null = null) {
        if (!isSignedIn.value) return;
        const db = getFirestore();
        let q = null;
        /**
         * maybe can look into reducing this if/else
         * the only difference is that if options.startAfter is not null
         * then we use startAfter() too
         */
        if (options.startAfter) {
            const postRef = doc(db, "posts", options.startAfter.id);
            const post = await getDoc(postRef);
            q = query(
                collection(db, "posts"),
                where("userId", "==", authId.value),
                orderBy("publishedAt", "desc"),
                startAfter(post),
                limit(10)
            );
        } else {
            q = query(
                collection(db, "posts"),
                where("userId", "==", authId.value),
                orderBy("publishedAt", "desc"),
                limit(10)
            );
        }
        const posts = await getDocs(q);
        let count = 0;
        posts.forEach((post) => {
            count++;
            postStore.setPost({ ...post.data(), id: post.id } as Post);
        });
        return count > 0;
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
        authId,
        authUserUnsubscribe,
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
        threadsCount,
        //setUser,
        updateUser,
        fetchAuthUser,
        signInWithEmailAndPass,
        signInWithGoogle,
        logout,
        setAuthId,
        setAuthUserUnsubscribe,
        unsubscribeAuthUserSnapshot,
        initAuthentication,
        fetchAuthUserPosts,
        fetchAuthUserThreads
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCurrentUserStore, import.meta.hot));
}
