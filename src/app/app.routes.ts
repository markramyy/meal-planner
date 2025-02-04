import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RecipesComponent } from './components/recipes/recipes.component';
import { AddRecipeComponent } from './components/add-recipe/add-recipe.component';
import { PlansComponent } from './components/plans/plans.component';
import { UsersComponent } from './components/users/users.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent},
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'recipes', component: RecipesComponent, canActivate: [AuthGuard] },
    { path: 'recipes/add', component: AddRecipeComponent, canActivate: [AuthGuard] },
    { path: 'plans', component: PlansComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
];
