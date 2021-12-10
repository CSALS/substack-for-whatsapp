import express, { Request, Response } from 'express';
import { UserModel } from './twilio.models';
import { subscribeUser, unsubscribeUser, getModels, registerAuthor, isExpectingPostFromTheUser } from './twilio.controller';
import { twiml } from 'twilio';

export const twilioRouter  = express.Router();

twilioRouter.get('/getModels', (req: Request, res: Response) => {
    res.json(getModels())
});

//TODO: exit ifs. maybe return message directly?
twilioRouter.post('/receive', (req: Request, res: Response) => {
    const userModel = req.body as UserModel;
    userModel.Body = userModel.Body.toLowerCase().trim();
    const userMessage = userModel.Body;

    let messageToSend = "Invalid command";

    if (userMessage.includes("hi") || userMessage.includes("hello") || userMessage.includes("hey")) {
        //if user doesn't exist
        messageToSend = "Hi there! \nWelcome to the Substack for India. \nSubscribe to an author to get receive articles";
        //if users exists show the list of commands they can use
    }

    if (userMessage.includes("help")) {
        //list of commands user can use
    }

    if (userMessage.includes("take feedback")) {
        //take feedback from subscribers
    }
    
    //READERS
    if (userMessage.includes("subscribe to")) {
        //subscribe current user to the given user
        //sample msg :- subscribe to <123456789>
        messageToSend = subscribeUser(userModel);
    }
    if (userMessage.includes("unsubscribe from")) {
        //unsubscribe current user from the given user
        //sample msg :- unsubscribe from <123456789>
        messageToSend = unsubscribeUser(userModel);
    }

    //WRITERS
    if (userMessage.includes("register")) {
        //register user in database
        messageToSend = registerAuthor(userModel);
    }
    if (userMessage.includes("unregister")) {
        //cleans user details from database
    }

    if (userMessage.includes("write post")) {
        //send response -> Please start writing below
        
    }
    if (userMessage.includes("yes")) {

    }
    if (userMessage.includes("no")) {

    }

    const isExpectingPost = isExpectingPostFromTheUser(userModel);
    if (isExpectingPost) {

    }
    
    /*
        Might be the content sent
        check if we sent the same user to write the post from our system
    */

    const customTwiml = new twiml.MessagingResponse();
    customTwiml.message(messageToSend);
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(customTwiml.toString());
});