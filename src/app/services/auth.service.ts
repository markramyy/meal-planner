import { Injectable } from '@angular/core';
import { FirebaseAuthService } from './firebase-auth.service';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private firebaseAuth: FirebaseAuthService, private firestore: Firestore, private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      this.isAuthenticatedSubject.next(!!user);
    });
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  async signup(email: string, password: string, additionalData: any): Promise<void> {
    try {
      const userCredential = await this.firebaseAuth.signup(email, password);
      const userId = userCredential.user?.uid;

      if (userId) {
        const userRef = doc(this.firestore, `users/${userId}`);
        await setDoc(userRef, { ...additionalData, email, createdAt: new Date() });
      }
    } catch (error) {
      throw error;
    }
  }

  login(email: string, password: string) {
    return this.firebaseAuth.login(email, password);
  }

  logout(): Promise<void> {
    return this.firebaseAuth.logout();
  }

  // Fetch the current authenticated user's data from Firestore
  async getUserData(): Promise<any> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const userRef = doc(this.firestore, `users/${currentUser.uid}`);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error('User data not found');
    }
  }

  getCurrentUserEmail(): string | null {
    return this.auth.currentUser ? this.auth.currentUser.email : null;
  }

}
