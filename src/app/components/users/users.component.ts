import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/users-follow';
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
      const [allUsers, followedUsers] = await Promise.all([
        this.userService.getAllUsers(),
        this.userService.getFollowedUsers()
      ]);

      this.users = allUsers
        .filter(user => user.uid !== this.authService.getCurrentUserId())
        .map(user => ({
          ...user,
          isFollowed: followedUsers.includes(user.uid)
        }));
      this.filteredUsers = [...this.users];
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

  async onFollow(user: User) {
    try {
      if (user.isFollowed) {
        await this.userService.unfollowUser(user.uid);
        user.isFollowed = false;
      } else {
        await this.userService.followUser(user.uid);
        user.isFollowed = true;
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  }
}
