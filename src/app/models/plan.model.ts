export interface PlanRecipe {
    mealType: string;
    recipeId: string;
    recipeName: string;
}

export interface Plan {
    id?: string;
    title: string;
    days: string[];
    recipes: PlanRecipe[];
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
}
