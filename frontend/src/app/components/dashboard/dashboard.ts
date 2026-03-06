import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {


  user: any;
  issues = [
    { id: 'A001', date: 'Jan 24, 2025', status: 'Open', statusClass: 'bg-info-subtle text-info' },
    { id: 'A890', date: 'Mar 10, 2025', status: 'Closed', statusClass: 'bg-success-subtle text-success' },
    { id: 'A657', date: 'Apr 10, 2025', status: 'Closed', statusClass: 'bg-success-subtle text-success' },
    { id: 'A546', date: 'May 20, 2025', status: 'Closed', statusClass: 'bg-success-subtle text-success' },
    { id: 'B435', date: 'Jul 25, 2025', status: 'Resolved', statusClass: 'bg-danger-subtle text-danger' },
    { id: 'A001', date: 'Jan 24, 2025', status: 'InProgress', statusClass: 'bg-warning-subtle text-warning' },
    { id: 'A890', date: 'Mar 10, 2025', status: 'Closed', statusClass: 'bg-success-subtle text-success' },
    { id: 'A657', date: 'Apr 10, 2025', status: 'Closed', statusClass: 'bg-success-subtle text-success' },
    { id: 'A546', date: 'May 20, 2025', status: 'Closed', statusClass: 'bg-success-subtle text-success' },
    { id: 'B435', date: 'Jul 25, 2025', status: 'Resolved', statusClass: 'bg-danger-subtle text-danger' },
  ];

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => this.user = user);
  }

}
