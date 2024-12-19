import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, updateDoc, getDoc, arrayUnion, arrayRemove } from '@angular/fire/firestore';
import { User, FirestoreUser } from '../models/users-follow';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  async getAllUsers(): Promise<User[]> {
    const usersCollection = collection(this.firestore, 'users');
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      uid: doc.id
    } as User));
  }

  async followUser(targetUid: string): Promise<void> {
    const currentUserId = this.authService.getCurrentUserId();
    if (currentUserId) {
      const userRef = doc(this.firestore, 'users', currentUserId);
      await updateDoc(userRef, {
        following: arrayUnion(targetUid)
      });
    }
  }

  async unfollowUser(targetUid: string): Promise<void> {
    const currentUserId = this.authService.getCurrentUserId();
    if (currentUserId) {
      const userRef = doc(this.firestore, 'users', currentUserId);
      await updateDoc(userRef, {
        following: arrayRemove(targetUid)
      });
    }
  }

  async getFollowedUsers(): Promise<string[]> {
    const currentUserId = this.authService.getCurrentUserId();
    if (currentUserId) {
      const userRef = doc(this.firestore, 'users', currentUserId);
      const userDoc = await getDoc(userRef);
      return userDoc.data()?.['following'] || [];
    }
    return [];
  }

}
