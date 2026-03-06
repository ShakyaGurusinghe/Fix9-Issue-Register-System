import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { IssueService } from '../../services/issue.service';

@Component({
  selector: 'app-issue-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './issue-form.html',
  styleUrl: './issue-form.css'
})
export class IssueForm implements OnInit {
  issueForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  projects: any[] = [];
  issueId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private issueService: IssueService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.issueForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      project_id: ['', Validators.required],
      priority: ['Medium', Validators.required],
      status: ['Open', Validators.required]
    });
  }

  ngOnInit() {
    this.loadProjects();
    this.issueId = this.route.snapshot.paramMap.get('id');
    if (this.issueId) {
      this.isEditMode = true;
      this.issueService.getIssue(this.issueId).subscribe({
        next: (data: any) => {
          this.issueForm.patchValue(data);
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Failed to load issue:', err)
      });
    }
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (data: any[]) => {
        this.projects = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Failed to load projects:', err)
    });
  }

  onSubmit() {
    if (this.issueForm.invalid) return;
    this.isSubmitting = true;
    const issueData = this.issueForm.value;

    if (this.isEditMode && this.issueId) {
      this.issueService.updateIssue(this.issueId, issueData).subscribe({
        next: () => this.router.navigate(['/issues']),
        error: (err: any) => { this.isSubmitting = false; console.error(err); }
      });
    } else {
      this.issueService.createIssue(issueData).subscribe({
        next: () => this.router.navigate(['/issues']),
        error: (err: any) => { this.isSubmitting = false; console.error(err); }
      });
    }
  }
}
