import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Robot } from '../../_interfaces/robot';
import { RobotType } from '../../_interfaces/robot-type';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-robots-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class RobotsList implements OnInit, OnDestroy {
  robots: Robot[] = [];
  robotTypes: RobotType[] = [];

  isLoading = false;
  error: string | null = null;
  success: string | null = null;
  deletingId: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load robot types first, then robots (fixes race condition)
   */
  loadAllData(): void {
    this.isLoading = true;
    this.error = null;
    this.cdr.markForCheck();

    const timeoutId = setTimeout(() => {
      if (this.isLoading) {
        console.error('Loading timed out');
        this.error = 'Loading took too long. Backend might not be running at http://localhost:5000';
        this.isLoading = false;
      }
    }, 5000);

    this.api
      .getRobotTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (types: RobotType[]) => {
          this.robotTypes = types;

          this.api
            .getRobots()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (robots) => {
                const typedRobots = robots as Robot[];

                this.robots = typedRobots.map((robot) => ({
                  ...robot,
                  robotTypeName: this.getRobotTypeName(robot.robotTypeId),
                }));
                this.isLoading = false;
                clearTimeout(timeoutId);
                this.cdr.markForCheck();
              },
            });
        },
        error: (err): void => {
          this.cdr.markForCheck();
          console.error('Error loading robot types:', err);
          this.error = 'Failed to load robot types';
          this.isLoading = false;
          clearTimeout(timeoutId);
        },
      });
  }

  getRobotTypeName(robotTypeId: number): string {
    const robotType = this.robotTypes.find((rt) => rt.id === robotTypeId);
    return robotType ? robotType.name : 'Unknown';
  }

  onCreateRobot(): void {
    this.router.navigate(['/robots/create']);
  }

  onEditRobot(robot: Robot): void {
    this.router.navigate(['/robots', robot.id, 'edit']);
  }

  onDeleteRobot(robot: Robot): void {
    if (confirm(`Are you sure you want to delete robot "${robot.name}"?`)) {
      this.deletingId = robot.id;

      this.api
        .deleteRobot(robot.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.success = `Robot "${robot.name}" deleted successfully!`;
            this.robots = this.robots.filter((r) => r.id !== robot.id);
            this.deletingId = null;
            this.cdr.markForCheck();
            setTimeout(() => {
              this.success = null;
            }, 3000);
          },
          error: (err: any) => {
            this.cdr.markForCheck();
            console.error('Error deleting robot:', err);
            this.error = 'Failed to delete robot';
            this.deletingId = null;
          },
        });
    }
  }

  onDismissError(): void {
    this.error = null;
  }

  onDismissSuccess(): void {
    this.success = null;
  }
}
