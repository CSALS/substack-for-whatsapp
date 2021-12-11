import express, { Request, Response } from 'express';
import { twilioRouter } from './twilio/twilio.router';

export const router  = express.Router();

router.use("/twilio", twilioRouter);

router.get("/", (req: Request, res: Response) => {
    res.status(200).send("Hello World!");
});