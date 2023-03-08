//class of helper functions

import type Category from "@/types/Category";
import type Forum from "@/types/Forum";
import type Thread from "@/types/Thread";
import type User from "@/types/User";

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

export { findById, stringToSlug };
