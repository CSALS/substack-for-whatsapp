import { TwilioUserModel, getPhoneNumber } from './twilio.models';
import { UserDetails, User } from '../models';
import {UserController} from "../firebase/firebase.controller";
import * as dotenv from "dotenv";
const twilio = require('twilio');

dotenv.config();

export class TwilioController {
    private userModel: TwilioUserModel
    private userController: UserController

    constructor(userModel: TwilioUserModel) {
        this.userController = new UserController()
        this.userModel = userModel
    }

    getRegisteredUser = async (): Promise<User | undefined> => {
        const users = await this.userController.getUsers()
        return users.find(user => user.details.number === getPhoneNumber(this.userModel))
    }

    registerUser = async (): Promise<string> => {
        try {
            const userNumber = getPhoneNumber(this.userModel)
            const users = await this.userController.getUsers()
            let user = users.find(user => user.details.number === userNumber)
            if (user) {
                return "Already registered";
            } else {
                await this.createNewUser()
                return "Successfully registered"
            }
        } catch (err) {
            console.log("Error in registering user", err);
            return "Unable to register\nTry again"
        }
    }

    subscribeUser = async (): Promise<string> => {
        try {
            const users = await this.userController.getUsers()
            const authorId = this.userModel.Body.split(" ")[2]
            const author = users.find(user => user.id === authorId)
            const userNumber = getPhoneNumber(this.userModel)
            let user = users.find(user => user.details.number === userNumber)
            if (!user) {
                user = await this.createNewUser()
            }

            let response = ""
            if (author) {
                let subscribers = author.details.subscribers
                if (subscribers) {
                    if (!subscribers.includes(user.id)) {
                        subscribers.push(user.id)
                        await this.userController.updateUserDetails(author.id, author.details)
                        response = `Subscribed To ${author.details.name}`
                    } else {
                        response = `Already Subscribed To ${author.details.name}`
                    }
                } else {
                    subscribers = [user.id]
                    await this.userController.updateUserDetails(author.id, author.details)
                    response = `Subscribed To ${author.details.name}`
                }
            } else {
                response = "Author Not Found"
            }
            return response
        } catch (err) {
            console.log(`Error in subscribing user ${err}`)
            return "Unable to subscribe\nPlease try again"
        }
    }

    unsubscribeUser = async (): Promise<string> => {
        try {
            const users = await this.userController.getUsers()
            const authorId = this.userModel.Body.split(" ")[2]
            const userNumber = getPhoneNumber(this.userModel)
            let user = users.find(user => user.details.number === userNumber)
            if (user) {
                let author = users.find(user => user.id === authorId)
                if (author) {
                    author.details.subscribers = author.details.subscribers.filter(subId => subId !== user!!.id)
                    await this.userController.updateUserDetails(author.id, author.details)
                    return `Successfully unsubscribed from ${authorId}`
                } else {
                    return `Author ${authorId} not found`;
                }
            } else {
                return "You are not registered\nSend \"register me\" to register"
            }
        } catch (err) {
            console.log(`Error in unsubscribing user ${err}`)
            return "Unable to unsubscribe\nPlease try again"
        }
    }

    initiateArticleWrite = async (): Promise<string> => {
        try {
            let user = await this.getRegisteredUser();
            if (!user) {
                return "You are not registered\nSend \"register me\" to register"
            }
            if (user.details.subscribers.length == 0) {
                return "You have no subscribers 😿"
            }
            if (!user.details.isExpectingArticle) {
                user.details.isExpectingArticle = true
                await this.userController.updateUserDetails(user.id, user.details)
            }
            return "Please start writing the article below";
        } catch (err) {
            console.log(`Error in initiating article write ${err}`)
            return "Internal Error.\nPlease try again"
        }
    }

    storeArticle = async (): Promise<string> => {
        try {
            let user = await this.getRegisteredUser();
            if (!user) {
                return "You are not registered\nSend \"register me\" to register"
            }

            if (!user.details.articles || user.details.articles.length === 0) {
                user.details.articles = [];
            }

            const articleId = TwilioController.getRandomString(4)
            user.details.articles.push({
                id: articleId,
                text: this.userModel.Body,
                mediaUrl: this.userModel.MediaUrl0 ? [this.userModel.MediaUrl0]: [],
                timestamp: new Date().getTime(),
                confirmed: false
            });

            user.details.isExpectingArticle = false
            await this.userController.updateUserDetails(user.id, user.details)
            return "Please confirm if you want to share the article? (yes or no)";
        } catch (err) {
            console.log(`Error in storing article ${err}`)
            return "Unable to store article\nPlease try again"
        }
    }

    sendArticleToSubscribers = async (): Promise<string> => {
        try {
            let user = await this.getRegisteredUser();
            if (!user) {
                return "You are not registered\nSend \"register me\" to register"
            }
            const article = user.details.articles.find(article => !article.confirmed)
            if (!article) {
                return "article not found"
            }
            article.confirmed = true

            if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
                throw Error("Twilio credentials not set")
            }
            const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
            const allUsers = await this.userController.getUsers()
            for (const subscriberId of user.details.subscribers) {
                const subscriber = allUsers.find(user => user.id === subscriberId)
                if (subscriber) {
                    await twilioClient.messages.create({
                        from: `whatsapp:${process.env.TWILIO_BOT_NUMBER}`,
                        body: `Article from ${user.details.name} :-\n${article.text}`,
                        mediaUrl: article.mediaUrl,
                        to: `whatsapp:+91${subscriber.details.number}`
                    })
                }
            }
            await this.userController.updateUserDetails(user.id, user.details)
            return `Sent to ${user.details.subscribers.length} subscribers successfully`
        } catch (err) {
            console.log(`Error in sending article ${err}`)
            return "Unable to send article\nPlease try again"
        }
    }

    cancelArticle = async (): Promise<string> => {
        try {
            let user = await this.getRegisteredUser()
            if (!user) {
                return "You are not registered\nSend \"register me\" to register"
            }
            const articleToRemoved = user.details.articles.find(article => !article.confirmed)
            if (articleToRemoved) {
                user.details.articles = user.details.articles.filter(article => article.id !== articleToRemoved.id)
                await this.userController.updateUserDetails(user.id, user.details)
            }
            return "Okay. No Problem!"
        } catch (err) {
            console.log(`Error in cancelling article ${err}`)
            return "Internal Error.\nPlease try again"
        }
    }

    getAuthorStatistics = async (): Promise<string> => {
        try {
            let user = await this.getRegisteredUser()
            if (!user) {
                return "You are not registered\nSend \"register me\" to register"
            }

            return "Here are your statistics \n" +
                `Total number of subscribers :- ${user.details.subscribers.length} \n` +
                `Total number of articles shared :- ${user.details.articles.length}`
        } catch (err) {
            console.log(`Error in getting author statistics ${err}`)
            return "Internal Error.\nPlease try again"
        }
    }

    getSubscriptions = async (): Promise<string> => {
        try {
            let user = await this.getRegisteredUser()
            if (!user) {
                return "You are not registered\nSend \"register me\" to register"
            }
            const allUsers = await this.userController.getUsers()
            let subscribedAuthors = ""
            allUsers.forEach((user) => {
                if (user.details.subscribers.find(subscriberId => subscriberId === user.id)) {
                    subscribedAuthors += `${user.details.name} (ID - ${user.id}) \n`
                }
            })

            if (subscribedAuthors === "") {
                return "You are not subscribed to anyone"
            } else {
                return "Here are your subscriptions :- \n" + subscribedAuthors
            }
        } catch (err) {
            console.log(`Error in getting subscriptions ${err}`)
            return "Internal Error.\nPlease try again"
        }
    }

    //Helper Functions
    isExpectingArticleFromTheUser = async (): Promise<boolean> => {
        let user = await this.getRegisteredUser();
        if (user) {
            return user.details.isExpectingArticle
        } else {
            return false
        }
    }

    private createNewUser = async (): Promise<User> => {
        const user = {
            id: TwilioController.getRandomString(6),
            details: {
                name: this.userModel.ProfileName,
                number: getPhoneNumber(this.userModel),
                articles: [],
                subscribers: [],
                isExpectingArticle: false
            } as UserDetails
        } as User
        await this.userController.createUser(user)
        return user
    }

    private static getRandomString(length: number): string {
        return (Math.random() + 1).toString(36).substring(length + 1)
    }
}