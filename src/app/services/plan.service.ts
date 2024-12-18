import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, addDoc } from '@angular/fire/firestore';
import { Plan } from '../models/plan.model';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  constructor(private firestore: Firestore) {}

  async getAllPlans(): Promise<Plan[]> {
    const plansCollection = collection(this.firestore, 'plans');
    const querySnapshot = await getDocs(plansCollection);

    // Map Firestore documents to Plan objects
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data['title'] || '',
        days: data['days'] || [],
        meals: data['meals'] || [],
        createdAt: data['createdAt'] ? new Date(data['createdAt']) : new Date(),
        updatedAt: data['updatedAt'] ? new Date(data['updatedAt']) : new Date(),
      } as Plan;
    });
  }

  async addPlan(plan: Plan) {
    const plansCollection = collection(this.firestore, 'plans');
    return await addDoc(plansCollection, {
      ...plan,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
