import * as dotenv from "dotenv";
dotenv.config();
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

initializeApp();
var serviceAccount = require(process.env.FIREBASE_CREDS_PATH as string);

initializeApp({
  credential: cert(serviceAccount)
});

export const database = getFirestore();
