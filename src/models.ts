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
    id: string[];
}