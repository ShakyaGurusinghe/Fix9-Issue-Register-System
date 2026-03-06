import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IssueService } from '../../services/issue.service';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  user: any;
  recentIssues: any[] = [];
  totalProjects = 0;
  totalIssues = 0;
  openIssues = 0;

  constructor(
    private authService: AuthService,
    private issueService: IssueService,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {
    this.authService.currentUser$.subscribe(user => this.user = user);
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Load issues (for table + stats)
    this.issueService.getIssues().subscribe({
      next: (issues: any[]) => {
        this.totalIssues = issues.length;
        this.openIssues = issues.filter(i => i.status === 'Open').length;
        this.recentIssues = issues.slice(0, 10); // top 10 most recent
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Failed to load issues:', err)
    });

    // Load project count
    this.projectService.getProjects().subscribe({
      next: (projects: any[]) => {
        this.totalProjects = projects.length;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Failed to load projects:', err)
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-info-subtle text-info';
      case 'inprogress': return 'bg-warning-subtle text-warning';
      case 'resolved': return 'bg-primary-subtle text-primary';
      case 'closed': return 'bg-success-subtle text-success';
      default: return 'bg-secondary-subtle text-secondary';
    }
  }
}
