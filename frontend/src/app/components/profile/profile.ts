import { Component } from '@angular/core';
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

  constructor(private authService: AuthService) {
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
        this.updateProfile();
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile() {
    this.authService.updateProfile({
      name: this.user.name,
      profile_photo: this.user.profile_photo
    }).subscribe();
  }

  confirmDelete() {
    this.authService.deleteAccount().subscribe();
  }
}
