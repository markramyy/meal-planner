import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../services/auth.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    RouterModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.signupForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const { email, password, ...additionalData } = this.signupForm.value;
      this.authService
        .signup(email, password, additionalData)
        .then(() => {
          console.log('Signup successful!');
          this.router.navigate(['/login']);
        })
        .catch((error) => {
          this.errorMessage = error.message || 'Failed to sign up!';
          alert(this.errorMessage);
        });
    }
  }
}
