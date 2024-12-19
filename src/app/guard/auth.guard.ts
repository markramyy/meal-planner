import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated(); // Check if the user is authenticated
    console.log('AuthGuard: isAuthenticated =', isAuthenticated);
    if (!isAuthenticated) {
      console.log('AuthGuard: User not authenticated, redirecting to login...');
      this.router.navigate(['/login']); // Redirect to login if not authenticated
      return false;
    }
    console.log('AuthGuard: Access granted');
    return true;
  }
}
