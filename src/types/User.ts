import type { FieldValue } from "@firebase/firestore";

/**
 * user type
 */
export default interface User {
    avatar?: string | null | File;
    bio?: string;
    email: string;
    lastVisitAt: number | FieldValue;
    name: string;
    isModerator: boolean;
    registeredAt: number | FieldValue;
    twitter?: string;
    username: string;
    usernameLower: string;
    website?: string;
    id?: string; //set as optional due to firestore not needing this
    threads?: string[];
    location?: string;
    postsCount?: number;
    threadsCount?: number;
}
