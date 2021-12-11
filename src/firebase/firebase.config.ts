import * as dotenv from "dotenv";
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

dotenv.config();

const serviceAccount = require(process.env.FIREBASE_CREDS_PATH as string);

initializeApp({
  credential: cert(serviceAccount)
});

export const database = getFirestore();
