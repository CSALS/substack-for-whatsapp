import { UserModel, getPhoneNumber } from './twilio.models';
import { User, Subscribers } from '../models';

const users: User[] = []; //TODO: shift to DB
const subs: Subscribers[] = []; //TODO: shift to DB
const expectingPostFromUser: number[] = []; //TODO: shift to DB

export const getModels = () => {
    return {
        users: users,
        subs: subs
    }
}

export const getRegisteredUser = (userModel: UserModel): User | undefined => {
    return users.find(user => user.number === getPhoneNumber(userModel));
}

export const initiatePostWrite = (userModel: UserModel): string => {
    let user = getRegisteredUser(userModel);
    if (!user) {
        return "You are not registered";
    }

    if (!expectingPostFromUser.find(userNumber => userNumber === user!!.number)) {
        expectingPostFromUser.push(user!!.number);   
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

    if (!user.posts || user.posts.length === 0) {
        user.posts = [];
    }
    user.posts.push({
        text: userModel.Body,
        media: userModel.MediaUrl0,
        timestamp: new Date().getTime()
    });

    return "Do you want to post it?";
}

export const registerAuthor = (userModel: UserModel): string => {
    const userNumber = getPhoneNumber(userModel)
    let user = users.find(user => user.number === userNumber);
    if (user) {
        return "Already registered";
    } else {
        user = {
            id: (Math.random() + 1).toString(36).substring(7),
            name: userModel.ProfileName,
            number: userNumber,
            posts: []
        } as User;
        users.push(user); //TODO: Replace with DB call
        return "Successfully registered"
    }
}

export const unsubscribeUser = (userModel: UserModel): string => {
    const authorId = userModel.Body.split(" ")[2];
    const userNumber = getPhoneNumber(userModel)
    let user = users.find(user => user.number === userNumber);
    if (user) {
        let author = subs.find(sub => sub.authorId === authorId);
        if (author) {
            author.subscriberIds = author.subscriberIds.filter(subId => subId !== user!!.id);
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
    let user = users.find(user => user.number === userNumber);
    if (!user) {
        user = {
            id: (Math.random() + 1).toString(36).substring(7),
            name: userModel.ProfileName,
            number: userNumber,
            posts: []
        } as User;
    }


    let response = "";
    if (author) {
        let subscribers = subs.find(sub => sub.authorId === authorId);
        if (subscribers) {
            if (!subscribers.subscriberIds.includes(user.id)) {
                subscribers.subscriberIds.push(user.id);
                response = `Subscribed To ${author.name}`;
            } else {
                response = `Already Subscribed To ${author.name}`;
            }
        } else {
            subscribers = {
                authorId: authorId,
                subscriberIds: [user.id]
            } as Subscribers;
            response = `Subscribed To ${author.name}`;
        }
        subs.push(subscribers); //TODO: Replace with DB call
        users.push(user); //TODO: Replace with DB call
    } else {
        response = "Author Not Found";
    }

    return response
}