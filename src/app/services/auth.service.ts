import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: { fullName: string; email: string; password: string }[] = [];

  login(email: string, password: string): boolean {
    const user = this.users.find((u) => u.email === email && u.password === password);
    return !!user;
  }

  signup(fullName: string, email: string, password: string): boolean {
    if (this.users.some((u) => u.email === email)) {
      return false; // User already exists
    }
    this.users.push({ fullName, email, password });
    return true;
  }
}
