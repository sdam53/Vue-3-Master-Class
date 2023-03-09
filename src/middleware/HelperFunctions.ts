//class of helper functions

import type Category from "@/types/Category";
import type Forum from "@/types/Forum";
import type Thread from "@/types/Thread";
import type User from "@/types/User";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedDate from "dayjs/plugin/localizedFormat";

dayjs.extend(relativeTime);
dayjs.extend(localizedDate);

/**
 * searches through an array and returns the item that matches with the id
 * TODO: This causes alot of errors so using any type rn
 * @param resources an array of users, threads, forums, or categories
 * @param id the id to search for
 */
const findById = (resources: Array<User | Thread | Forum | Category | any>, id: string): any => {
    if (resources === null || id === null) return null;
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

export { findById, stringToSlug, diffForHumans, humanFriendlyDate, upsert };
