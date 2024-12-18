export interface Plan {
    id?: string;
    title: string;
    days: string[];
    meals: string[];
    createdAt?: Date;
    updatedAt?: Date;
}
