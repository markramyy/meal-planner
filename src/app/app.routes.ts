import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    // { path: 'dashboard', component: DashboardComponent },
    // { path: 'profile', component: ProfileComponent },
    // { path: 'recipes', component: RecipesComponent },
    // { path: 'plans', component: PlansComponent },
    // { path: 'users', component: UsersComponent },
    // { path: '**', redirectTo: 'login' }, // Wildcard for 404 page
];
