import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RobotType } from '../../_interfaces/robot-type';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List implements OnInit, OnDestroy {
  robotTypes: RobotType[] = [];
  loading: boolean = false;
  error: string | null = null;
  success: string | null = null;
  deletingId: number | null = null; // Track which item is being deleted

  private destroy$ = new Subject<void>();
  private successTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadRobotTypes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
    }
  }

  loadRobotTypes(): void {
    this.loading = true;
    this.error = null;
    this.success = null;
    this.cdr.markForCheck();

    this.api
      .getRobotTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.robotTypes = data;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.error = 'Failed to load robot types';
          this.loading = false;
          console.error('Error loading robot types:', err);
          this.cdr.markForCheck();
        },
      });
  }

  onViewSketch(robotTypeId: number): void {
    // Navigate to sketch viewer/editor with robot type ID
    this.router.navigate(['/robot-types', robotTypeId, 'sketch']);
  }

  onDelete(robotTypeId: number): void {
    const robotType = this.robotTypes.find((rt) => rt.id === robotTypeId);
    if (!robotType) return;

    // Confirmation dialog
    if (
      !confirm(`Are you sure you want to delete "${robotType.name}"? This action cannot be undone.`)
    ) {
      return;
    }

    this.deletingId = robotTypeId;
    this.error = null;
    this.success = null;
    this.cdr.markForCheck();

    this.api
      .deleteRobotType(robotTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Remove from list
          this.robotTypes = this.robotTypes.filter((rt) => rt.id !== robotTypeId);
          this.success = `"${robotType.name}" deleted successfully`;
          this.deletingId = null;
          this.cdr.markForCheck();

          // Clear success message after 4 seconds
          this.successTimeout = setTimeout(() => {
            this.success = null;
            this.cdr.markForCheck();
          }, 4000);
        },
        error: (err) => {
          this.error = `Failed to delete "${robotType.name}"`;
          this.deletingId = null;
          console.error('Error deleting robot type:', err);
          this.cdr.markForCheck();
        },
      });
  }

  isDeleting(robotTypeId: number): boolean {
    return this.deletingId === robotTypeId;
  }
}
