import { database } from './firebase.config';
import { User, UserDetails } from '../models';
import { firestore } from "firebase-admin/lib/firestore/firestore-namespace";
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;

export class UserCollectionController {
    private COLLECTION_NAME = 'users'

    async getUsers(): Promise<User[]> {
        const users: User[] = [];
        const snapshot = await database.collection(this.COLLECTION_NAME).get();
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
            users.push({
                id: doc.id,
                details: doc.data() as UserDetails
            })
        });
        return users;
    }

    async createUser(user: User) {
        const userRef = database.collection(this.COLLECTION_NAME);
        await userRef.doc(user.id).set(user.details);
    }

    async updateUserDetails(authorId: string, details: UserDetails) {
        await database.collection(this.COLLECTION_NAME).doc(authorId).update(details)
    }
}