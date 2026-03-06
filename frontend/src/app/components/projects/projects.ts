import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects implements OnInit {
  projects: any[] = [];
  showDeleteModal = false;
  projectToDelete: string | null = null;

  constructor(private projectService: ProjectService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Failed to load projects:', err)
    });
  }

  openDeleteModal(id: string, event: Event) {
    event.stopPropagation();
    this.projectToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.projectToDelete) {
      this.projectService.deleteProject(this.projectToDelete).subscribe({
        next: () => {
          this.loadProjects();
          this.showDeleteModal = false;
          this.projectToDelete = null;
        },
        error: (err: any) => console.error('Failed to delete project:', err)
      });
    }
  }
}
