import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { Recipe } from '../../models/recipe.model';
import { User } from '../../models/user.model';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, RouterLink],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})

export class RecipesComponent implements OnInit {
  recipes: any[] = [];
  filteredRecipes: any[] = [];
  selectedTab: 'all' | 'my' = 'all';
  searchQuery: string = '';
  currentUserId: string = '';

  readonly defaultImageUrl: string = 'assets/images/empty-card.png';

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId() || '';
    this.loadRecipes();
  }

  getRecipeImage(recipe: Recipe): string {
    return recipe.imageUrl || this.defaultImageUrl;
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = this.defaultImageUrl;
    }
  }

  async loadRecipes(): Promise<void> {
    try {
      const allRecipes = await this.recipeService.getRecipes();
      this.recipes = allRecipes;
      this.applyFilters();
    } catch (error) {
      console.error('Error loading recipes:', error);
    }
  }

  applyFilters(): void {
    if (this.selectedTab === 'all') {
      this.filteredRecipes = this.recipes.filter(
        (recipe) => recipe.userId !== this.currentUserId
      );
    } else {
      this.filteredRecipes = this.recipes.filter(
        (recipe) => recipe.userId === this.currentUserId
      );
    }

    // Apply search query
    if (this.searchQuery) {
      this.filteredRecipes = this.filteredRecipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  switchTab(tab: 'all' | 'my'): void {
    this.selectedTab = tab;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

}
