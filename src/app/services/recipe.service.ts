import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor(private firestore: Firestore) {}

  async addRecipe(recipe: any) {
    const recipesCollection = collection(this.firestore, 'recipes');
    return await addDoc(recipesCollection, recipe);
  }

  async getRecipes() {
    const recipesCollection = collection(this.firestore, 'recipes');
    const recipesQuery = query(recipesCollection);
    const querySnapshot = await getDocs(recipesQuery);
    return querySnapshot.docs.map((doc) => doc.data());
  }
}
