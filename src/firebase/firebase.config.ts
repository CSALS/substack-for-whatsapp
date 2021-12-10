import * as dotenv from "dotenv";
dotenv.config();

var admin = require("firebase-admin");
var serviceAccount = require(process.env.FIREBASE_CREDS_PATH as string);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://team-jordan-default-rtdb.firebaseio.com",
});

export const database = admin.database();
