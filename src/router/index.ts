/**
 * Page router
 */

import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/HomeView.vue";
import NotFound from "@/views/NotFoundView.vue";
import Thread from "@/views/ThreadShowView.vue";
import ThreadCreate from "@/views/ThreadCreateView.vue";
import Forum from "@/views/ForumView.vue";
import Category from "@/views/CategoryView.vue";
import Profile from "@/views/ProfileView.vue";
import { useSourceDataStore } from "@/stores/SourceDataStore";

//const sourceData = useSourceDataStore();

//list of out routes
const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/forum/:id/:slug",
        name: "Forum",
        component: Forum,
        props: true
    },
    {
        path: "/category/:id/:slug",
        name: "Category",
        component: Category,
        props: true
    },
    {
        path: "/thread/:id/:slug",
        name: "ThreadShow",
        component: Thread,
        props: true
        //this basically will check if this endpoint is right, and if not we get sent to notFound
        //TODO: figure out to, from, next types
        //TODO: pinia isnt created at this point so have to remove this for now. figure it out
        /*
        beforeEnter(to: any, from: any, next: any) {
            const threadExist = sourceData.threads.find((thread) => thread.id === to.params.id);
            console.log(threadExist);
            if (!threadExist)
                return {
                    name: "NotFound",
                    params: {
                        pathMatch: to.path.substring(1).split("/")
                    },
                    query: to.query,
                    hash: to.hash
                };
            else next();
        }
        */
    },
    {
        //https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22
        path: "/form/:forumId/thread/create",
        name: "ThreadCreate",
        component: ThreadCreate,
        props: true
    },
    {
        path: "/me",
        name: "Profile",
        component: Profile,
        meta: { toTop: true, smoothScroll: true }
    },
    {
        path: "/me/edit",
        name: "ProfileEdit",
        component: Profile,
        props: { edit: true }
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFound
    }
];

//exporting it
export default createRouter({
    history: createWebHistory(),
    routes: routes,
    scrollBehavior(to) {
        const scroll = {};
        //TODO: Figure out how to deal with these errors. Prob define scroll
        if (to.meta.toTop) scroll.top = 0;
        if (to.meta.smoothScroll) scroll.behavior = "smooth";
        return scroll;
    }
});
