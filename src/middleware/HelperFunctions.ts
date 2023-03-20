//class of helper functions

import type Category from "@/types/Category";
import type Forum from "@/types/Forum";
import type Thread from "@/types/Thread";
import type User from "@/types/User";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedDate from "dayjs/plugin/localizedFormat";
import type { DocumentReference } from "@firebase/firestore";
import { useCategoriesStore } from "@/stores/CategoriesStore";
import { useForumsStore } from "@/stores/ForumsStore";
import { useThreadsStore } from "@/stores/ThreadsStore";
import { usePostsStore } from "@/stores/PostsStore";
import { useUsersStore } from "@/stores/UsersStore";
import type Post from "@/types/Post";

dayjs.extend(relativeTime);
dayjs.extend(localizedDate);

/**
 * searches through an array and returns the item that matches with the id
 * TODO: This causes alot of errors so using any type rn
 * @param resources an array of users, threads, forums, or categories
 * @param id the id to search for
 */
const findById = (
    resources: Array<User | Thread | Forum | Category | Post>,
    id: string | null
): User | Thread | Forum | Category | Post | undefined | null => {
    if (!id) return null;
    if (!resources || !id) return null;
    return resources.find((item) => item.id === id);
};

/**
 * convert a string into a friendly url formatted slug
 * @param title the string to be converted
 * @return string slugged string
 */
const stringToSlug = (title: string): string => {
    let res = title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    return res;
};

/**
 * returns time relative to us
 * @param timestamp
 *
 */
const diffForHumans = (timestamp: number) => {
    return dayjs.unix(timestamp).fromNow();
};

/**
 * returns a readable date and time
 * @param timestamp
 *
 */
const humanFriendlyDate = (timestamp: number) => {
    return dayjs.unix(timestamp).format("llll");
};

/**
 * inserts or updates a list
 * @param resources list of resource
 * @param resource json object that contains a id value
 */
const upsert = (resources: any[], resource: any) => {
    let index = resources.findIndex((e) => e.id === resource.id);

    if (resource.id && index !== -1) {
        resources[index] = resource;
    } else {
        resources.push(resource);
    }
};

/**
 * converts db doc to object
 * @param doc doc doc obj
 */
const docToResource = (doc: any) => {
    if (typeof doc?.data !== "function") return doc;
    return { ...doc.data(), id: doc.id };
};

/**
 * sets an item
 * @param item the item
 * @param resource the type of resource
 */
const setItem = (item: any, resource: any) => {
    switch (resource) {
        case "categories":
            let catStore = useCategoriesStore();
            catStore.setCategory(item);
            break;
        case "forums":
            let forumStore = useForumsStore();
            forumStore.setForum(item);
            break;
        case "threads":
            let threadsStore = useThreadsStore();
            threadsStore.setThread(item);
            break;
        case "posts":
            let postsStore = usePostsStore();
            postsStore.setPost(item);
            break;
        case "users":
            let usersStore = useUsersStore();
            usersStore.setUser(item);
            break;
    }
};

export { findById, stringToSlug, diffForHumans, humanFriendlyDate, upsert, docToResource, setItem };
