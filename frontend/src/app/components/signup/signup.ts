import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {

  userData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  error = '';
  successMessage = '';
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.error = '';
    this.successMessage = '';

    if (this.userData.password.length < 8) {
      this.error = 'Password must be at least 8 characters.';
      return;
    }

    if (this.userData.password !== this.userData.confirmPassword) {
      this.error = "Passwords don't match";
      return;
    }


    this.authService.signup(this.userData).subscribe({
      next: () => {
        this.successMessage = 'Account created successfully! Redirecting to sign in...';
        setTimeout(() => {
          this.router.navigate(['/signin']);
        }, 2000);
      },
      error: (err: any) => {
        // Handle various error structures from backend
        if (err.error && err.error.error) {
          this.error = err.error.error;
        } else if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Signup failed. Please check your inputs and try again.';
        }
      }
    });
  }
}

