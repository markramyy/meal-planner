import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, addDoc, query, where } from '@angular/fire/firestore';
import { Plan } from '../models/plan.model';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  constructor(private firestore: Firestore) {}

  async getUserPlans(userId: string): Promise<Plan[]> {
    const plansCollection = collection(this.firestore, 'plans');
    const q = query(plansCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    } as Plan));
  }

  async addPlan(plan: Plan) {
    const plansCollection = collection(this.firestore, 'plans');
    return await addDoc(plansCollection, plan);
  }
}
