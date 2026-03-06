import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IssueService } from '../../services/issue.service';

@Component({
  selector: 'app-issues',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './issues.html',
  styleUrl: './issues.css'
})
export class Issues implements OnInit {
  issues: any[] = [];
  searchQuery = '';
  showDeleteModal = false;
  issueToDelete: any = null;

  constructor(private issueService: IssueService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadIssues();
  }

  loadIssues() {
    this.issueService.getIssues().subscribe({
      next: (data: any[]) => {
        this.issues = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Failed to load issues:', err)
    });
  }

  get filteredIssues() {
    if (!this.searchQuery) return this.issues;
    const q = this.searchQuery.toLowerCase();
    return this.issues.filter(i =>
      i.title?.toLowerCase().includes(q) ||
      i.id?.toString().includes(q)
    );
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

  confirmDelete(issue: any) {
    this.issueToDelete = issue;
    this.showDeleteModal = true;
  }

  deleteIssue() {
    if (this.issueToDelete) {
      this.issueService.deleteIssue(this.issueToDelete.id).subscribe({
        next: () => {
          this.loadIssues();
          this.showDeleteModal = false;
          this.issueToDelete = null;
        },
        error: (err: any) => console.error('Failed to delete issue:', err)
      });
    }
  }
}
