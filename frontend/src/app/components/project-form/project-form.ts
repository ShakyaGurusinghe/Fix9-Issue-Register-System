import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project.service';


@Component({
  selector: 'app-project-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './project-form.html',
  styleUrl: './project-form.css'
})
export class ProjectForm implements OnInit {
  isEditMode = false;
  projectId: string | null = null;
  project = {
    name: '',
    description: '',
    image: ''
  };

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.isEditMode = true;
      this.projectService.getProject(this.projectId).subscribe({
        next: (project: any) => {
          this.project = project;
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Failed to load project:', err)
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.project.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.isEditMode && this.projectId) {
      this.projectService.updateProject(this.projectId, this.project).subscribe({
        next: () => this.router.navigate(['/projects']),
        error: (err: any) => console.error('Failed to update project:', err)
      });
    } else {
      this.projectService.createProject(this.project).subscribe({
        next: () => this.router.navigate(['/projects']),
        error: (err: any) => console.error('Failed to create project:', err)
      });
    }
  }
}
