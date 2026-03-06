import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { IssueService } from '../services/issue.service';

@Component({
  selector: 'app-project-detail',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css'
})
export class ProjectDetail implements OnInit {
  project: any;
  issues: any[] = [];
  isLoadingIssues = true;

  constructor(
    private projectService: ProjectService,
    private issueService: IssueService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Load project details
      this.projectService.getProject(id).subscribe({
        next: (project: any) => {
          this.project = project;
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Failed to load project:', err)
      });

      // Load issues for this project
      this.issueService.getProjectIssues(id).subscribe({
        next: (issues: any[]) => {
          this.issues = issues;
          this.isLoadingIssues = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Failed to load project issues:', err);
          this.isLoadingIssues = false;
          this.cdr.detectChanges();
        }
      });
    }
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

  getPriorityClass(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-danger';
      case 'medium': return 'text-warning';
      case 'low': return 'text-info';
      default: return 'text-secondary';
    }
  }
}
