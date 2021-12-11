import { UserModel, getPhoneNumber } from './twilio.models';
import { UserDetails, User } from '../models';

const users: User[] = []; //TODO: shift to DB
const expectingPostFromUser: number[] = []; //TODO: shift to DB

export const getModels = () => {
    return {
        users: users
    }
}

export const getRegisteredUser = (userModel: UserModel): User | undefined => {
    return users.find(user => user.details.number === getPhoneNumber(userModel));
}

export const initiatePostWrite = (userModel: UserModel): string => {
    let user = getRegisteredUser(userModel);
    if (!user) {
        return "You are not registered";
    }

    if (!expectingPostFromUser.find(userNumber => userNumber === user!!.details.number)) {
        expectingPostFromUser.push(user!!.details.number);
    }
    return "Please start writing the article below";
}

export const isExpectingPostFromTheUser = (userModel: UserModel): boolean => {
    return expectingPostFromUser.find(userNumber => userNumber === getPhoneNumber(userModel)) !== undefined;
}

export const storePost = (userModel: UserModel): string => {
    let user = getRegisteredUser(userModel);
    if (!user) {
        return "You are not registered";
    }

    if (!user.details.posts || user.details.posts.length === 0) {
        user.details.posts = [];
    }
    user.details.posts.push({
        text: userModel.Body,
        media: userModel.MediaUrl0,
        timestamp: new Date().getTime()
    });

    return "Do you want to post it?";
}

export const registerAuthor = (userModel: UserModel): string => {
    const userNumber = getPhoneNumber(userModel)
    let user = users.find(user => user.details.number === userNumber);
    if (user) {
        return "Already registered";
    } else {
        user = {
            id: (Math.random() + 1).toString(36).substring(7),
            details: {
                name: userModel.ProfileName,
                number: userNumber,
                posts: [],
                subscribers: []
            } as UserDetails
        } as User;
        users.push(user); //TODO: Replace with DB call
        return "Successfully registered"
    }
}

export const unsubscribeUser = (userModel: UserModel): string => {
    const authorId = userModel.Body.split(" ")[2];
    const userNumber = getPhoneNumber(userModel)
    let user = users.find(user => user.details.number === userNumber);
    if (user) {
        let author = users.find(user => user.id === authorId);
        if (author) {
            author.details.subscribers = author.details.subscribers.filter(subId => subId !== user!!.id);
            return `Successfully unsubscribed from ${authorId}`;
        } else {
            return `Author ${authorId} not found`;
        }
    } else {
        return "You are not registered";
    }
}

export const subscribeUser = (userModel: UserModel): string => {
    const authorId = userModel.Body.split(" ")[2];
    const author = users.find(user => user.id === authorId);
    const userNumber = getPhoneNumber(userModel)
    let user = users.find(user => user.details.number === userNumber);
    if (!user) {
        user = {
            id: (Math.random() + 1).toString(36).substring(7),
            details: {
                name: userModel.ProfileName,
                number: userNumber,
                posts: [],
                subscribers: []
            } as UserDetails
        } as User;
    }


    let response = "";
    if (author) {
        let subscribers = author.details.subscribers;
        if (subscribers) {
            if (!subscribers.includes(user.id)) {
                subscribers.push(user.id);
                response = `Subscribed To ${author.details.name}`;
            } else {
                response = `Already Subscribed To ${author.details.name}`;
            }
        } else {
            subscribers = [user.id]
            response = `Subscribed To ${author.details.name}`;
        }
        users.find(user => user.id === author.id)!!.details.subscribers = subscribers;
    } else {
        response = "Author Not Found";
    }

    return response
}