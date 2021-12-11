export interface User {
    id: string;
    details: UserDetails;
}

export interface UserDetails {
    name: string;
    number: number;
    articles: Article[];
    subscribers: string[];
    isExpectingArticle: boolean;
}

export interface Article {
    id: string;
    text: string;
    mediaUrl: string[];
    timestamp: number;
    confirmed: boolean;
}

export const isAuthor = (user: User): boolean => {
    return user.details.subscribers.length > 0;
}