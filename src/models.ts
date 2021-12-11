export interface User {
    id: string;
    details: UserDetails
}

export interface UserDetails {
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

export const isAuthor = (user: UserDetails): boolean => {
    return user.posts.length > 0;
}