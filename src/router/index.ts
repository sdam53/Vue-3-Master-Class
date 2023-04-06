// @ts-nocheck
//TODO:3 erros with modifying scroll behavior
/**
 * Router to handle page routing
 */

import { findById } from "@/middleware/HelperFunctions";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { createRouter, createWebHistory, type RouteLocationNormalized } from "vue-router";

//import { useSourceDataStore } from "@/stores/SourceDataStore";
//const sourceData = useSourceDataStore();

//list of the routes
const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import(/*webpackChunkName: "Home"*/ "@/views/HomeView.vue")
    },
    {
        path: "/forum/:id/:slug?",
        name: "Forum",
        component: () => import(/*webpackChunkName: "Forum"*/ "@/views/ForumView.vue"),
        props: true
    },
    {
        path: "/category/:id/:slug?",
        name: "Category",
        component: () => import(/*webpackChunkName: "Category"*/ "@/views/CategoryView.vue"),
        props: true
    },
    {
        //https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22
        path: "/forum/:forumId/thread/create",
        name: "ThreadCreate",
        component: () =>
            import(/*webpackChunkName: "ThreadCreate"*/ "@/views/ThreadCreateView.vue"),
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: "/thread/:id/edit",
        name: "ThreadEdit",
        component: () => import(/*webpackChunkName: "ThreadEdit"*/ "@/views/ThreadEditView.vue"),
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: "/thread/:id/:slug?", //'?' makes it optional
        name: "ThreadShow",
        component: () => import(/*webpackChunkName: "ThreadShow"*/ "@/views/ThreadShowView.vue"),
        props: true,
        //this basically will check if this endpoint is right, and if not we get sent to notFound
        async beforeEnter(to: RouteLocationNormalized, from: RouteLocationNormalized) {
            const threadStore = useThreadsStore();
            await threadStore.fetchThread(to.params.id as string, { once: true });
            const threadExist = findById(threadStore.threads, to.params.id as string);
            if (!threadExist) {
                return {
                    name: "NotFound",
                    params: {
                        pathMatch: to.path.substring(1).split("/")
                    },
                    //preserve existing query and hash
                    query: to.query,
                    hash: to.hash
                };
            } else {
                return true;
            }
        }
    },
    {
        path: "/threads/all",
        name: "ThreadsAll",
        component: () => import(/*webpackChunkName: "ThreadsAll"*/ "@/views/ThreadsAllView.vue")
    },
    {
        path: "/me",
        name: "Profile",
        component: () => import(/*webpackChunkName: "Profile"*/ "@/views/ProfileView.vue"),
        meta: { toTop: true, smoothScroll: true, requiresAuth: true }
    },
    {
        path: "/me/edit",
        name: "ProfileEdit",
        component: () => import(/*webpackChunkName: "ProfileEdit"*/ "@/views/ProfileView.vue"),
        meta: { toTop: true, smoothScroll: true, requiresAuth: true },
        props: { edit: true }
    },
    {
        //I would like username slug too but theres some issues with current version
        path: "/user/:id",
        name: "ProfileUsers",
        component: () =>
            import(/*webpackChunkName: "ProfileUsers"*/ "@/views/ProfileUsersView.vue"),
        props: true
    },
    {
        path: "/login",
        name: "Login",
        component: () => import(/*webpackChunkName: "Login"*/ "@/views/LoginView.vue"),
        meta: { requiresGuest: true }
    },
    {
        path: "/logout",
        name: "Logout",
        component: () => import(/*webpackChunkName: "Logout"*/ "@/views/LogoutView.vue")
    },
    /*
    {
        //If you dont want to have a page for logout
        path: "/logout",
        name: "Logout",
        beforeEnter(to, from, next) {
            const currentUserStore = useCurrentUserStore();
            await currentUserStore.logout();
            next({name: "Home"});
        }
    },
    */
    {
        path: "/register",
        name: "Register",
        component: () => import(/*webpackChunkName: "Register"*/ "@/views/RegisterView.vue"),
        meta: { requiresGuest: true }
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import(/*webpackChunkName: "NotFound"*/ "@/views/NotFoundView.vue")
    }
];

//exporting it and adding options
const router = createRouter({
    history: createWebHistory(),
    routes: routes,
    scrollBehavior(to) {
        //TODO: Figure out how to deal with these errors. Prob define scroll
        scroll.top = 0;
        if (to.meta.smoothScroll) scroll.behavior = "smooth";
        return scroll;
    }
});

router.afterEach(() => {
    /*
    //something is not making it working right
    const postsStore = usePostsStore();
    const forumsStore = useForumsStore();
    const threadsStore = useThreadsStore();
    const categoriesStore = useCategoriesStore();
    const firebaseStore = useFirebaseStore();
    postsStore.clearPosts();
    forumsStore.clearForums();
    threadsStore.clearThreads();
    categoriesStore.clearCategories();
    firebaseStore.unsubscribeAllSnapshots();
    */
});

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    const timeOutConst = 700;

    const currentUserStore = useCurrentUserStore();
    await currentUserStore.initAuthentication();
    const firebaseStore = useFirebaseStore();
    await firebaseStore.unsubscribeAllSnapshots();
    //if the page requires auth user then they will get sent to / if they arent signed in
    if (to.meta.requiresAuth) {
        //setTimeout(() => {
        const currentUserStore = useCurrentUserStore();
        if (!currentUserStore.isSignedIn)
            router.push({ name: "Login", query: { redirectTo: to.path } });
        //}, timeOutConst);
    }
    if (to.meta.requiresGuest) {
        //setTimeout(() => {
        const currentUserStore = useCurrentUserStore();
        if (currentUserStore.isSignedIn) router.push({ name: "Home" });
        //}, timeOutConst);
    }
});

export default router;
