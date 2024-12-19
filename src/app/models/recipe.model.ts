export interface Recipe {
    id?: string;
    title: string;
    time: number;
    servings: number;
    ingredientsCount: number;
    ingredients: {name: string, quantity: number}[];
    mealType: string[];
    userId: string;
    imageUrl: string;
    updatedAt?: Date;
}

export interface Ingredient {
    name: string;
    quantity: number;
}
