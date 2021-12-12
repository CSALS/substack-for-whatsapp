import express, { Request, Response } from 'express';
import { TwilioUserModel } from './twilio.models';
import { TwilioController } from './twilio.controller';
import { twiml } from 'twilio';

export const twilioRouter  = express.Router();

twilioRouter.post('/receive', async (req: Request, res: Response) => {
    console.log(`Received message from ${JSON.stringify(req.body)}`)
    const userModel = req.body as TwilioUserModel
    const twilioController = new TwilioController(userModel)
    userModel.Body = userModel.Body.toLowerCase().trim()
    const userMessage = userModel.Body

    let messageToSend = ""

    const isExpectingPost = await twilioController.isExpectingArticleFromTheUser()
    const isExpectingLanguagePreference = await twilioController.isExpectingLanguagePreferenceFromTheUser()
    if (isExpectingPost) {
        messageToSend = await twilioController.storeArticle()
    }
    else if (isExpectingLanguagePreference) {
        messageToSend = await twilioController.changeLanguagePreference()
    }
    else if (userMessage.includes("write article")) {
        messageToSend = await twilioController.initiateArticleWrite()
    }
    else if (userMessage.includes("yes")) {
        messageToSend = await twilioController.sendArticleToSubscribers()
    }
    else if (userMessage.includes("no")) {
        messageToSend = await twilioController.cancelArticle()
    }
    else if (userMessage.includes("hi") || userMessage.includes("hello") || userMessage.includes("hey")) {
        messageToSend = "Hi there 😃\nWelcome to the *Substack-For-Whatsapp*. \nSubscribe to an author to receive articles";
    }
    else if (userMessage.includes("subscribe to")) {
        messageToSend = await twilioController.subscribeUser()
    }
    else if (userMessage.includes("change language")) {
        messageToSend = await twilioController.expectingLanguagePreference()
    }
    else if (userMessage.includes("unsubscribe from")) {
        messageToSend = await twilioController.unsubscribeUser();
    }
    else if (userMessage.includes("register me")) {
        messageToSend = await twilioController.registerUser();
    }
    else if (userMessage.includes("my subscriptions")) {
        messageToSend = await twilioController.getSubscriptions()
    }
    else if (userMessage.includes("my stats")) {
        messageToSend = await twilioController.getAuthorStatistics()
    }
    else if (userMessage.includes("my user id")) {
        messageToSend = await twilioController.getUserId()
    }
    else if (userMessage.includes("my qr code")) {
        messageToSend = await twilioController.generateQRCodeWebsite()
    }
    else if (userMessage.includes("help")) {
        messageToSend =
            "Hey there 🙂\n" +
            "Here are list of commands you can use :- \n" +
            "- If you are not yet registered send *register me* \n" +
            "- If you want to subscribe to an author send *subscribe to <AuthorID>* \n" +
            "- If you want to unsubscribe from an author send *unsubscribe from <AuthorID>* \n" +
            "- If you want to write an article for your subscribers send *write article* \n" +
            "- If you want to list your subscriptions send *my subscriptions* \n" +
            "- If you want to find your statistics send *my stats* \n" +
            "- If you want to know your user id send *my user id* \n" +
            "- If you want to download your QR code send *my qr code* \n" +
            "- If you want to change language in which you receive articles send *change language* \n"
    }
    else {
        messageToSend = "Invalid command 🤨\nPress *help* to check list of commands"
    }

    const customTwiml = new twiml.MessagingResponse();
    customTwiml.message(messageToSend);
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(customTwiml.toString());
});