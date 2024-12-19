import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where } from '@angular/fire/firestore';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  constructor(private firestore: Firestore) {}

  async addRecipe(recipe: Recipe) {
    try {
      const recipesCollection = collection(this.firestore, 'recipes');
      return await addDoc(recipesCollection, recipe);
    } catch (error) {
      console.error('Error adding recipe:', error);
      throw error;
    }
  }

  async getRecipes(): Promise<Recipe[]> {
    try {
      const recipesCollection = collection(this.firestore, 'recipes');
      const querySnapshot = await getDocs(recipesCollection);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Recipe));
    } catch (error) {
      console.error('Error getting recipes:', error);
      throw error;
    }
  }

  async getUserRecipes(userId: string) {
    try {
      const recipesCollection = collection(this.firestore, 'recipes');
      const q = query(recipesCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting user recipes:', error);
      throw error;
    }
  }
}
