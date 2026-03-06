import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-project-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css'
})
export class ProjectDetail implements OnInit {
  project: any;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectService.getProject(id).subscribe({
        next: (project: any) => {
          this.project = project;
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Failed to load project:', err)
      });
    }
  }
}
