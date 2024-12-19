import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';
import { Recipe, Ingredient } from '../../models/recipe.model';

@Component({
  selector: 'app-add-recipe',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './add-recipe.component.html',
  styleUrl: './add-recipe.component.scss'
})
export class AddRecipeComponent {
  recipeTitle: string = '';
  time: number = 0;
  servings: number = 0;
  mealTypes: string[] = ['Breakfast', 'Snack', 'Lunch', 'Dessert', 'Dinner'];
  selectedMealTypes: string[] = [];
  ingredients: Ingredient[] = [];
  imageFile: File | null = null;
  imageFileUrl: string | null = null;
  showIngredientModal = false;
  newIngredient: Ingredient = { name: '', quantity: 0 };

  private readonly MAX_IMAGE_SIZE = 1024 * 1024;
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router
  ) {}

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    try {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];

        // Validate file type
        if (!this.ALLOWED_TYPES.includes(file.type)) {
          throw new Error('Please select a valid image file (JPEG, PNG, or WEBP)');
        }

        // Validate file size
        if (file.size > this.MAX_IMAGE_SIZE) {
          throw new Error('Image size must be less than 1MB');
        }

        this.imageFile = file;
        this.convertImageToBase64(this.imageFile);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error processing image');
      // Reset file input
      input.value = '';
      this.imageFile = null;
      this.imageFileUrl = null;
    }
  }

  private convertImageToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageFileUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async onSaveRecipe() {
    if (!this.recipeTitle || !this.time || !this.servings || this.selectedMealTypes.length === 0) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const recipe: Recipe = {
        title: this.recipeTitle,
        time: this.time,
        servings: this.servings,
        ingredientsCount: this.ingredients.length,
        ingredients: this.ingredients,
        mealType: this.selectedMealTypes,
        userId: this.authService.getCurrentUserId() || '',
        imageUrl: this.imageFileUrl || '',
        updatedAt: new Date()
      };

      await this.recipeService.addRecipe(recipe);
      this.router.navigate(['/recipes']);
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Error saving recipe');
    }
  }

  toggleMealType(type: string): void {
    const index = this.selectedMealTypes.indexOf(type);
    if (index === -1) {
      this.selectedMealTypes.push(type);
    } else {
      this.selectedMealTypes.splice(index, 1);
    }
  }

  toggleIngredientModal() {
    this.showIngredientModal = !this.showIngredientModal;
    this.newIngredient = { name: '', quantity: 0 };
  }

  addIngredient() {
    if (this.newIngredient.name && this.newIngredient.quantity > 0) {
      this.ingredients.push({...this.newIngredient});
      this.toggleIngredientModal();
    }
  }
}
