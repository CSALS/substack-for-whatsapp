import { database } from './firebase.config';
import { UserEntry } from '../models';
import { Post } from '../models';


const usersRef = database.collection('users');

export const createUser = async(key: string, value: UserEntry) => {
    
    try {
        await usersRef.doc(key).set(value);
        return true;
      } catch (e) {
        console.log('Transaction failure:', e);
        return false;
      }
}

export const updateUser = async(key: string, value: any) => {

    try {
        await usersRef.doc(key).set(value);
        return true;
      } catch (e) {
        console.log('Transaction failure:', e);
        return false;
      }
}

export const deleteUser = async(key: string) => {
    try {
        await usersRef.doc(key).delete();
        return true;
      } catch (e) {
        console.log('Transaction failure:', e);
        return false;
      }
}

export const createPost = async(key: string, post:Post) => {
    try {
        await usersRef.doc(key).doc('posts').add(post);
        return true;
      } catch (e) {
        console.log('Transaction failure:', e);
        return false;
      }
}


