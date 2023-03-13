import type { FieldValue } from "@firebase/firestore";

/**
 * thread type
 */
export default interface Thread {
    contributors: string[];
    firstPostId: string;
    forumId: string;
    lastPostAt: number;
    lastPostId: string;
    posts: string[];
    publishedAt: number | FieldValue; //serverTimestamp;
    slug: string;
    title: string;
    userId: string;
    id: string;
}
