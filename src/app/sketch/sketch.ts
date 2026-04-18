import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import paper from 'paper';
import { Point } from '../_interfaces/point';

@Component({
  selector: 'app-sketch',
  standalone: true,
  imports: [],
  templateUrl: './sketch.html',
  styleUrl: './sketch.scss',
})
export class Sketch implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @Input() initialSketch: Point[] = [];
  @Output() sketchUpdated = new EventEmitter<Point[]>();

  private tool!: paper.Tool;
  private path!: paper.Path;
  private allPoints: Point[] = [];

  ngAfterViewInit(): void {
    const canvas = this.canvas.nativeElement;

    // IMPORTANT: wait one frame so layout is correct
    requestAnimationFrame(() => {
      this.initPaper(canvas);
      if (this.initialSketch.length > 0) {
        this.loadSketch(this.initialSketch);
      }
    });
  }

  private initPaper(canvas: HTMLCanvasElement) {
    // Set real pixel size (CRITICAL)
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    paper.setup(canvas);

    paper.view.viewSize = new paper.Size(canvas.width, canvas.height);

    this.tool = new paper.Tool();
    this.tool.activate();

    this.tool.onMouseDown = (event: paper.ToolEvent) => {
      this.path = new paper.Path({
        strokeColor: 'black',
        strokeWidth: 3,
        strokeCap: 'round',
        strokeJoin: 'round',
      });

      this.path.add(event.point);
      const point: Point = { x: event.point.x, y: event.point.y };
      this.allPoints.push(point);
      console.log('Start point: ', event.point);
    };

    this.tool.onMouseDrag = (event: paper.ToolEvent) => {
      this.path.add(event.point);
      const point: Point = { x: event.point.x, y: event.point.y };
      this.allPoints.push(point);
      console.log('Dragged to point: ', event.point);
    };

    this.tool.onMouseUp = (event: paper.ToolEvent) => {
      console.log('End point: ', event.point);
      this.path.smooth();
      this.sketchUpdated.emit(this.allPoints);
    };
  }

  loadSketch(points: Point[]): void {
    if (!points || points.length === 0) return;

    // Draw the sketch from points
    const paths = this.groupPointsIntoPaths(points);

    paths.forEach((pointGroup) => {
      const path = new paper.Path({
        strokeColor: 'black',
        strokeWidth: 3,
        strokeCap: 'round',
        strokeJoin: 'round',
      });

      pointGroup.forEach((point) => {
        path.add(new paper.Point(point.x, point.y));
      });

      path.smooth();
    });

    this.allPoints = JSON.parse(JSON.stringify(points));
  }

  private groupPointsIntoPaths(points: Point[]): Point[][] {
    // Group consecutive points into paths
    // This is a simple implementation - adjust based on your data format
    const paths: Point[][] = [];
    const tolerance = 50; // pixels distance to consider as new path

    let currentPath: Point[] = [];
    let lastPoint: Point | null = null;

    points.forEach((point) => {
      if (lastPoint === null) {
        currentPath.push(point);
      } else {
        const distance = Math.sqrt(
          Math.pow(point.x - lastPoint.x, 2) + Math.pow(point.y - lastPoint.y, 2),
        );

        if (distance > tolerance) {
          if (currentPath.length > 0) {
            paths.push(currentPath);
          }
          currentPath = [point];
        } else {
          currentPath.push(point);
        }
      }
      lastPoint = point;
    });

    if (currentPath.length > 0) {
      paths.push(currentPath);
    }

    return paths;
  }

  clearSketch(): void {
    // Clear all paths from the canvas
    paper.project.clear();
    this.allPoints = [];
    this.sketchUpdated.emit([]);
    console.log('Sketch cleared');
  }

  getSketch(): Point[] {
    return this.allPoints;
  }

  // Handle resize properly (VERY important in Angular apps)
  @HostListener('window:resize')
  onResize() {
    const canvas = this.canvas.nativeElement;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    paper.view.viewSize = new paper.Size(canvas.width, canvas.height);
  }
}
