import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RobotType } from '../../_interfaces/robot-type';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List implements OnInit {
  robotTypes: RobotType[] = [];
  robotType: RobotType = {
    id: 0,
    name: '',
    dimensions: '',
    sketch: [],
  };
  loading: boolean = false;
  error: string | null = null;
  isSubmitting: boolean = false;
  successMessage: string | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadRobotTypes();
  }

  loadRobotTypes(): void {
    this.loading = true;
    this.error = null;
    this.api.getRobotTypes().subscribe({
      next: (data) => {
        this.robotTypes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load robot types';
        this.loading = false;
        console.error('Error loading robot types:', err);
      },
    });
  }

  addRobotType() {
    if (!this.robotType.name || !this.robotType.dimensions) {
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;

    this.api.createRobotType(this.robotType).subscribe({
      next: (response) => {
        console.log('Robot type created:', response);
        this.successMessage = `Robot type "${this.robotType.name}" created successfully!`;
        // Reset form and reload the list
        this.robotType = {
          id: 0,
          name: '',
          dimensions: '',
          sketch: [],
        };
        this.isSubmitting = false;
        this.loadRobotTypes();
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error creating robot type:', err);
        this.isSubmitting = false;
      },
    });
  }
}
