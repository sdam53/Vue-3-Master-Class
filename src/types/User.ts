/**
 * user type
 */
export default interface User {
    avatar: string;
    bio?: string;
    email: string;
    lastVisitAt: number;
    name: string;
    isModerator: boolean;
    registeredAt: number;
    twitter?: string;
    username: string;
    usernameLower: string;
    website?: string;
    id: string;
    threads?: string[];
    location?: string;
    postsCount?: number;
    threadsCount?: number;
}
