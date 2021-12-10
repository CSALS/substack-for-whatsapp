export interface User {
    id: string;
    name: string;
    number: number;
    posts: Post[];
}

export interface Post {
    text: string;
    media: string;
    timestamp: number;
}

export interface Subscribers {
    authorId: string;
    subscriberIds: string[];
}

export const isAuthor = (user: User): boolean => {
    return user.posts.length > 0;
}