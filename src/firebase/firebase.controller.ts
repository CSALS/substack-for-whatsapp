import { database } from './firebase.config';
import { UserEntry } from '../models';

const usersRef = database.ref('/node');

export const findUsers = ()=>{
    usersRef.on('value', (snapshot: any) => {
        return snapshot.val();
    })
}

export const createUser = (key: string, value: UserEntry) => {
    usersRef.child(key).set(value);
}

export const updateUser = (key: string, value: UserEntry) => {
    usersRef.child(key).update(value);
}

export const deleteUser = (key: string) => {
    usersRef.child(key).remove();
}

export const findUsersById = (key: string) => {
    usersRef.child(key).on('value', (snapshot: any) => {
       return snapshot.val();
    })
}

