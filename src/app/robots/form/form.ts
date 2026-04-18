import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Robot } from '../../_interfaces/robot';
import { RobotType } from '../../_interfaces/robot-type';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-robots-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class RobotsForm implements OnInit, OnDestroy {
  robot: Robot = {
    id: 0,
    name: '',
    robotTypeId: 0,
  };

  robotTypes: RobotType[] = [];
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
    this.loadRobotTypes();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      const numId = Number(id);
      if (!isNaN(numId)) {
        this.loadRobot(numId);
      } else {
        this.error = 'Invalid robot ID';
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

  loadRobotTypes(): void {
    this.api
      .getRobotTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: RobotType[]) => {
          this.robotTypes = data;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error loading robot types:', err);
          this.error = 'Failed to load robot types';
        },
      });
  }

  loadRobot(id: number): void {
    this.isLoading = true;
    this.error = null;

    const timeoutId = setTimeout(() => {
      if (this.isLoading) {
        console.error('Robot loading timed out');
        this.error = 'Loading took too long. Backend might not be running at http://localhost:5000';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    }, 5000);

    this.api
      .getRobot(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Robot) => {
          clearTimeout(timeoutId);

          this.robot = data;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err: any) => {
          clearTimeout(timeoutId);
          console.error('Error loading robot:', err);
          const errorMsg = err?.error?.message || err?.message || `HTTP ${err?.status || 'Error'}`;
          this.error = `Failed to load robot: ${errorMsg}`;
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
    if (!this.robot.name || !this.robot.robotTypeId) {
      this.error = 'Name and robot type are required';
      return;
    }

    this.isSubmitting = true;
    this.error = null;
    this.success = null;

    const operation = this.isEdit
      ? this.api.updateRobot(this.robot.id, this.robot)
      : this.api.createRobot(this.robot);

    operation.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response: any) => {
        this.success = this.isEdit ? 'Robot updated successfully!' : 'Robot created successfully!';
        this.isSubmitting = false;

        // Navigate back to list after 1.5 seconds
        setTimeout(() => {
          this.router.navigate(['/robots']);
        }, 1500);
      },
      error: (err: any) => {
        this.error = this.isEdit ? 'Failed to update robot' : 'Failed to create robot';
        this.isSubmitting = false;
        console.error('Error saving robot:', err);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/robots']);
  }
}
