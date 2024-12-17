import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    DatePipe
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userData: User | null = null;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.authService.getUserData();
      this.userData = {
        ...data,
        dateOfBirth: data.dateOfBirth instanceof Timestamp ?
          data.dateOfBirth.toDate() :
          new Date(data.dateOfBirth)
      };
      this.loading = false;
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to fetch user data.';
      this.loading = false;
    }
  }
}
