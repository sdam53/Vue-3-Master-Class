import type Category from "./Category";
import type Forum from "./Forum";
import type Post from "./Post";
import type Stats from "./Stats";
import type Thread from "./Thread";
import type User from "./User";

/**
 * source data type
 */
export default interface SourceData {
    categories: Category[];
    forums: Forum[];
    posts: Post[];
    stats: Stats;
    threads: Thread[];
    users: User[];
}
