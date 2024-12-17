import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})

export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  currentUserEmail: string | null = null;
  loading: boolean = true;
  searchTerm: string = '';

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUserEmail = this.authService.getCurrentUserEmail();
    this.fetchUsers();
  }

  async fetchUsers() {
    try {
      const allUsers = await this.userService.getAllUsers();

      // Filter out the authenticated user
      this.users = allUsers.filter(user => user.email !== this.currentUserEmail);
      this.filteredUsers = [...this.users]; // Initialize filteredUsers
      this.loading = false;
    } catch (error) {
      console.error('Error fetching users:', error);
      this.loading = false;
    }
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
  }

  onFollow(user: User) {
    console.log('Following user:', user.email);
    this.userService.followUser(user.email).then(() => {
      console.log(`Followed ${user.email}`);
    });
  }
}
