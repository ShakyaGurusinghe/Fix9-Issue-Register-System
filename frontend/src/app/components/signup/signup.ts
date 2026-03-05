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
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (this.userData.password !== this.userData.confirmPassword) {
      this.error = "Passwords don't match";
      return;
    }

    this.authService.signup(this.userData).subscribe({
      next: () => {
        this.router.navigate(['/signin']);
      },
      error: (err: any) => {
        this.error = err.error.error || 'Signup failed';
      }
    });
  }
}
