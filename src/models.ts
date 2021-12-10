export interface UserEntry {
    id: string;
    user: User
}

export interface User {
    name: string;
    number: number;
    posts: Post[];
    subscribers: string[];
}

export interface Post {
    text: string;
    media: string;
    timestamp: number;
}

export const isAuthor = (user: User): boolean => {
    return user.posts.length > 0;
}