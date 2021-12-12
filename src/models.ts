export interface User {
    id: string;
    details: UserDetails;
}

export const LanguageToCodeMap = new Map<string, string>([
    ["english" , "en"],
    ["bengali" , "bn"],
    ["gujarati" , "gu"],
    ["hindi" , "hi"],
    ["kannada" , "kn"],
    ["malayalam" , "ml"],
    ["marathi" , "mr"],
    ["oriya" , "or"],
    ["punjabi" , "pa"],
    ["sindhi" , "sd"],
    ["tamil" , "ta"],
    ["telugu" , "te"],
    ["urdu" , "ur"]
])

export const DEFAULT_LANGUAGE = "english"


export interface UserDetails {
    name: string;
    number: number;
    articles: Article[];
    subscribers: string[];
    isExpectingArticle: boolean;
    isExpectingLanguagePreference: boolean;
    preferredLanguage: string;
}

export interface Article {
    id: string;
    text: string;
    mediaUrl: string[];
    timestamp: number;
    confirmed: boolean;
}