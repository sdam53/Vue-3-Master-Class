export default interface Post {
    edited?: {
        at: number;
        by: string;
        moderated: boolean;
    };
    publishedAt: number;
    reactions?: any; //deal with it later
    text: string;
    threadId: string;
    userId: string;
    id: string;
}
