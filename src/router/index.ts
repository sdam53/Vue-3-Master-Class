/**
 * Router to handle page routing
 */

import { createRouter, createWebHistory, type RouteLocationNormalized } from "vue-router";
import Home from "@/views/HomeView.vue";
import NotFound from "@/views/NotFoundView.vue";
import Thread from "@/views/ThreadShowView.vue";
import ThreadCreate from "@/views/ThreadCreateView.vue";
import ThreadEdit from "@/views/ThreadEditView.vue";
import Register from "@/views/RegisterView.vue";
import Login from "@/views/LoginView.vue";

import Forum from "@/views/ForumView.vue";
import Category from "@/views/CategoryView.vue";
import Profile from "@/views/ProfileView.vue";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import Logout from "@/views/LogoutView.vue";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { findById } from "@/middleware/HelperFunctions";

//import { useSourceDataStore } from "@/stores/SourceDataStore";
//const sourceData = useSourceDataStore();

//list of the routes
const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/forum/:id/:slug?",
        name: "Forum",
        component: Forum,
        props: true
    },
    {
        path: "/category/:id/:slug?",
        name: "Category",
        component: Category,
        props: true
    },
    {
        //https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22
        path: "/forum/:forumId/thread/create",
        name: "ThreadCreate",
        component: ThreadCreate,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: "/thread/:id/edit",
        name: "ThreadEdit",
        component: ThreadEdit,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: "/thread/:id/:slug?", //'?' makes it optional
        name: "ThreadShow",
        component: Thread,
        props: true,
        //this basically will check if this endpoint is right, and if not we get sent to notFound
        async beforeEnter(to: RouteLocationNormalized, from: RouteLocationNormalized) {
            const threadStore = useThreadsStore();
            await threadStore.fetchThread(to.params.id as string, true);
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
        path: "/me",
        name: "Profile",
        component: Profile,
        meta: { toTop: true, smoothScroll: true, requiresAuth: true }
    },
    {
        path: "/me/edit",
        name: "ProfileEdit",
        component: Profile,
        meta: { toTop: true, smoothScroll: true, requiresAuth: true },
        props: { edit: true }
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: { requiresGuest: true }
    },
    {
        path: "/logout",
        name: "Logout",
        component: Logout
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
        component: Register,
        meta: { requiresGuest: true }
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFound
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

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    const timeOutConst = 700;

    let currentUserStore = useCurrentUserStore();
    await currentUserStore.initAuthentication();
    let firebaseStore = useFirebaseStore();
    firebaseStore.clearAllUnsubscriptions();
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
