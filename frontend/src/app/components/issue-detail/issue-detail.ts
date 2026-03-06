import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { IssueService } from '../../services/issue.service';

@Component({
  selector: 'app-issue-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './issue-detail.html',
  styleUrl: './issue-detail.css'
})
export class IssueDetail implements OnInit {
  issue: any = null;

  constructor(
    private issueService: IssueService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.issueService.getIssue(id).subscribe({
        next: (data: any) => {
          this.issue = data;
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Failed to load issue:', err)
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
