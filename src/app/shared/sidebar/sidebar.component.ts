import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  userName: string = '';
  userEmail: string = '';
  loading: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  async loadUserData() {
    try {
      const userData = await this.authService.getUserData();
      this.userName = userData.username;
      this.userEmail = userData.email;
      this.loading = false;
    } catch (error) {
      console.error('Error fetching user data:', error);
      this.loading = false;
    }
  }

  logout(): void {
    this.authService
      .logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Logout failed', error);
      });
  }
}
