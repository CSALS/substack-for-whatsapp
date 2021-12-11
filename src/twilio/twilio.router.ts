import express, { Request, Response } from 'express';
import { TwilioUserModel } from './twilio.models';
import { TwilioController } from './twilio.controller';
import { twiml } from 'twilio';

export const twilioRouter  = express.Router();

twilioRouter.post('/receive', async (req: Request, res: Response) => {
    const userModel = req.body as TwilioUserModel
    const twilioController = new TwilioController(userModel)
    userModel.Body = userModel.Body.toLowerCase().trim()
    const userMessage = userModel.Body

    let messageToSend = ""

    const isExpectingPost = await twilioController.isExpectingArticleFromTheUser()
    if (isExpectingPost) {
        messageToSend = await twilioController.storeArticle()
    }
    else if (userMessage === "write article") {
        messageToSend = await twilioController.initiateArticleWrite()
    }
    else if (userMessage === "yes") {
        messageToSend = await twilioController.sendArticleToSubscribers()
    }
    else if (userMessage === "no") {
        messageToSend = await twilioController.cancelArticle()
    }
    else if (userMessage === "hi" || userMessage === "hello" || userMessage === "hey") {
        messageToSend = "Hi there 😃\nWelcome to the *Substack-For-Whatsapp*. \nSubscribe to an author to receive articles";
    }
    else if (userMessage.includes("subscribe to")) {
        messageToSend = await twilioController.subscribeUser();
    }
    else if (userMessage.includes("unsubscribe from")) {
        messageToSend = await twilioController.unsubscribeUser();
    }
    else if (userMessage === "register me") {
        messageToSend = await twilioController.registerUser();
    }
    else if (userMessage === "my subscriptions") {
        messageToSend = await twilioController.getSubscriptions()
    }
    else if (userMessage === "my stats") {
        messageToSend = await twilioController.getAuthorStatistics()
    }
    else if (userMessage === "help") {
        messageToSend =
            "Hey there 🙂\n" +
            "Here are list of commands you can use :- \n" +
            "- If you are not yet registered send *register me* \n" +
            "- If you want to subscribe to an author send *subscribe to <AuthorID>* \n" +
            "- If you want to unsubscribe from an author send *unsubscribe from <AuthorID>* \n" +
            "- If you want to write an article for your subscribers send *write article* \n" +
            "- If you want to list your subscriptions send *my subscriptions* \n" +
            "- If you want to find your statistics send *my stats* \n"
    }
    else {
        messageToSend = "Invalid command 🤨\nPress *help* to check list of commands"
    }

    const customTwiml = new twiml.MessagingResponse();
    customTwiml.message(messageToSend);
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(customTwiml.toString());
});