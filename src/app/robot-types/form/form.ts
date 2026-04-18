import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RobotType } from '../../_interfaces/robot-type';
import { Point } from '../../_interfaces/point';
import { ApiService } from '../../api.service';
import { Sketch } from '../../sketch/sketch';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Sketch],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form implements OnInit, OnDestroy {
  @ViewChild('sketchComponent') sketchComponent!: Sketch;

  robotType: RobotType = {
    id: 0,
    name: '',
    dimensions: '',
    sketch: [],
  };

  isEdit = false;
  isLoading = false;
  isSubmitting = false;
  error: string | null = null;
  success: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Check if we're in edit mode

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      const numId = Number(id);
      if (!isNaN(numId)) {
        this.loadRobotType(numId);
      } else {
        this.error = 'Invalid robot type ID';
        this.isLoading = false;
      }
    } else {
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRobotType(id: number): void {
    this.isLoading = true;
    this.error = null;

    // Timeout safety: if request takes more than 5 seconds, stop loading
    const timeoutId = setTimeout(() => {
      if (this.isLoading) {
        this.error = 'Loading took too long. Backend might not be running at http://localhost:5000';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    }, 5000);

    this.api
      .getRobotType(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: RobotType) => {
          clearTimeout(timeoutId);

          this.robotType = data;
          this.isLoading = false;

          // Force change detection to update form fields
          this.cdr.markForCheck();
          this.sketchComponent.loadSketch(this.robotType.sketch || []);
        },
        error: (err: any) => {
          clearTimeout(timeoutId);
          const errorMsg = err?.error?.message || err?.message || `HTTP ${err?.status || 'Error'}`;
          this.error = `Failed to load robot type: ${errorMsg}`;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        complete: () => {
          clearTimeout(timeoutId);
        },
      });
  }

  onSubmit(): void {
    // Validation
    if (!this.robotType.name || !this.robotType.dimensions) {
      this.error = 'Name and dimensions are required';
      return;
    }

    this.isSubmitting = true;
    this.error = null;
    this.success = null;

    // Get the latest sketch data from the sketch component
    if (this.sketchComponent) {
      this.robotType.sketch = this.sketchComponent.getSketch();
    }

    const operation = this.isEdit
      ? this.api.updateRobotType(this.robotType.id, this.robotType)
      : this.api.createRobotType(this.robotType);

    operation.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.success = this.isEdit
          ? 'Robot type updated successfully!'
          : 'Robot type created successfully!';
        this.isSubmitting = false;

        // Navigate back to list after 1.5 seconds
        setTimeout(() => {
          this.router.navigate(['/robot-types']);
        }, 1500);
      },
      error: (err) => {
        this.error = this.isEdit ? 'Failed to update robot type' : 'Failed to create robot type';
        this.isSubmitting = false;
      },
    });
  }

  onSketchUpdated(sketch: Point[]): void {
    this.robotType.sketch = sketch;
    this.cdr.markForCheck();
  }

  onClearSketch(): void {
    if (this.sketchComponent) {
      this.sketchComponent.clearSketch();
      this.robotType.sketch = [];
    }
  }

  onCancel(): void {
    this.router.navigate(['/robot-types']);
  }
}
