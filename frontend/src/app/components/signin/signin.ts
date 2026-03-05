import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signin',
  imports: [FormsModule, CommonModule],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {

  credentials = {
    email: '',
    password: ''
  };
  error = '';
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.signin(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error.error || 'Invalid credentials';
      }
    });
  }
}
