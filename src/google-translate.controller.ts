const { Translate } = require('@google-cloud/translate').v2;
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.GOOGLE_TRANSLATE_CREDENTIALS) {
    console.log("Google translate credentials not provided")
    process.exit(1)
}

const CREDENTIALS = JSON.parse(process.env.GOOGLE_TRANSLATE_CREDENTIALS)

const translate = new Translate({
    credentials: CREDENTIALS,
    projectId: CREDENTIALS["project_id"]
});

export const translateText = async (text: string, targetLanguage: string) => {
    console.log(text)
    console.log(targetLanguage)
    try {
        let [response] = await translate.translate(text, targetLanguage);
        return response;
    } catch (err) {
        console.log(`Error at translateText --> ${err}`);
        throw err
    }
};