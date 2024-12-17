import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, updateDoc } from '@angular/fire/firestore';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore) {}

  async getAllUsers(): Promise<User[]> {
    const usersCollection = collection(this.firestore, 'users');
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map((doc) => doc.data() as User);
  }

  async followUser(email: string): Promise<void> {
    const userRef = doc(this.firestore, `users/${email}`);
    await updateDoc(userRef, { followed: true });
  }
}
