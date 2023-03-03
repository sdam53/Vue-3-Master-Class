/**
 * Page router
 */

import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/HomeView.vue";
import NotFound from "@/views/NotFoundView.vue";
import Thread from "@/views/ThreadShowView.vue";
import Forum from "@/views/ForumView.vue";
import Category from "@/views/CategoryView.vue";
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
        //TODO figure out to, from, next types
        //TODO pinia isnt created at this point so have to remove this for now
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
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFound
    }
];

//exporting it
export default createRouter({
    history: createWebHistory(),
    routes: routes
});
