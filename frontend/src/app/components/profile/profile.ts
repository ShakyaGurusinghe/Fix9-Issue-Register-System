import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  user: any = {};
  showDeleteModal = false;
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {
    this.authService.currentUser$.subscribe(user => {
      this.user = { ...(user || {}) };
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.profile_photo = e.target.result;
        this.cdr.detectChanges(); // update preview immediately
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile() {
    this.successMessage = '';
    this.errorMessage = '';
    this.authService.updateProfile({
      name: this.user.name,
      profile_photo: this.user.profile_photo
    }).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully!';
        this.cdr.detectChanges();   // force Angular to render the toast
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.error || 'Failed to update profile.';
        this.cdr.detectChanges();
      }
    });
  }

  confirmDelete() {
    this.authService.deleteAccount().subscribe({
      error: (err: any) => {
        this.showDeleteModal = false;
        this.errorMessage = err.error?.error || 'Failed to delete account.';
        this.cdr.detectChanges();
      }
    });
  }
}
