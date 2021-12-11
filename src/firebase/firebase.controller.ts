import { database } from './firebase.config';
import { User, UserDetails } from '../models';
import {firestore} from "firebase-admin/lib/firestore/firestore-namespace";
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;

export class UserController {
    async getUsers(): Promise<User[]> {
        const users: User[] = [];
        const snapshot = await database.collection('users').get();
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
            users.push({
                id: doc.id,
                details: doc.data() as UserDetails
            })
        });
        return users;
    }

    async createUser(user: User) {
        try {
            const userRef = database.collection('users').doc(user.id);
            await userRef.doc(user.id).set(user.details);
            return "Created"
        } catch (err) {
            console.log("Error in creating user", err);
        }
    }
}