//class of helper functions

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

export { stringToSlug };
