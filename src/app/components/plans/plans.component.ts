import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { PlanService } from '../../services/plan.service';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';
import { Plan, PlanRecipe } from '../../models/plan.model';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
  ],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss',
})

export class PlansComponent implements OnInit {
  plans: Plan[] = [];
  filteredPlans: Plan[] = [];
  showAddPlanForm: boolean = false;
  loading: boolean = true;
  newPlan!: Plan;

  selectedMealType: string = '';
  selectedRecipe: string = '';
  filteredRecipes: Recipe[] = [];
  allRecipes: Recipe[] = [];

  readonly mealTypes: string[] = ['Breakfast', 'Lunch', 'Dinner', 'Desert', 'Snack'];
  readonly daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedDay: string = 'All';

  constructor(
    private planService: PlanService,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.initializeNewPlan();
    await this.loadPlans();
    await this.loadRecipes();
  }

  private initializeNewPlan(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User must be authenticated');
    }

    this.newPlan = {
      title: '',
      days: [],
      recipes: [],
      userId: userId
    };
  }

  async loadRecipes(): Promise<void> {
    try {
      const recipes = await this.recipeService.getRecipes();
      this.allRecipes = recipes;
    } catch (error) {
      console.error('Error loading recipes:', error);
      this.allRecipes = [];
    }
  }

  async loadPlans(): Promise<void> {
    try {
      const userId = this.authService.getCurrentUserId();
      if (userId) {
        this.plans = await this.planService.getUserPlans(userId);
        this.filteredPlans = [...this.plans];
      }
    } finally {
      this.loading = false;
    }
  }

  filterByDay(day: string): void {
    this.selectedDay = day;
    if (day === 'All') {
      this.filteredPlans = [...this.plans];
    } else {
      this.filteredPlans = this.plans.filter(plan => plan.days.includes(day));
    }
  }

  onMealTypeChange() {
    if (this.selectedMealType) {
      this.filteredRecipes = this.allRecipes.filter(recipe =>
        recipe.mealType.includes(this.selectedMealType)
      );
    }
  }

  addRecipeToPlan() {
    if (this.selectedMealType && this.selectedRecipe) {
      const recipe = this.allRecipes.find(r => r.id === this.selectedRecipe);
      if (recipe) {
        this.newPlan.recipes.push({
          mealType: this.selectedMealType,
          recipeId: recipe.id!,
          recipeName: recipe.title
        });
      }
      // Reset selections
      this.selectedMealType = '';
      this.selectedRecipe = '';
      this.filteredRecipes = [];
    }
  }

  removeRecipe(recipe: PlanRecipe) {
    const index = this.newPlan.recipes.indexOf(recipe);
    if (index > -1) {
      this.newPlan.recipes.splice(index, 1);
    }
  }

  onDaySelect(event: any) {
    const day = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      this.newPlan.days.push(day);
    } else {
      const index = this.newPlan.days.indexOf(day);
      if (index > -1) {
        this.newPlan.days.splice(index, 1);
      }
    }
  }

  isFormValid(): boolean {
    return this.newPlan.title !== '' &&
           this.newPlan.recipes.length > 0 &&
           this.newPlan.days.length > 0;
  }

  toggleAddPlanForm(): void {
    this.showAddPlanForm = true;
  }

  async savePlan() {
    if (this.isFormValid()) {
      const userId = this.authService.getCurrentUserId();
      if (userId) {
        const plan: Plan = {
          ...this.newPlan,
          userId,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await this.planService.addPlan(plan);
        this.showAddPlanForm = false;
        this.loadPlans();
      }
    }
  }
}
