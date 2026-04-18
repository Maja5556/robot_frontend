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
    this.api.createRobotType(this.robotType).subscribe({
      next: (response) => {
        console.log('Robot type created:', response);
        // Reset form and reload the list
        this.robotType = {
          id: 0,
          name: '',
          dimensions: '',
          sketch: [],
        };
        this.loadRobotTypes();
      },
      error: (err) => {
        console.error('Error creating robot type:', err);
      },
    });
  }
}
