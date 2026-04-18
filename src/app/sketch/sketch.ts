import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as paper from 'paper';

@Component({
  selector: 'app-sketch',
  imports: [],
  templateUrl: './sketch.html',
  styleUrl: './sketch.scss',
})
export class Sketch implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  private tool!: paper.Tool;
  private path!: paper.Path;

  ngAfterViewInit(): void {
    const canvas = this.canvas.nativeElement;

    // IMPORTANT: match real pixel size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    paper.setup(canvas);

    // ALSO IMPORTANT: set Paper view size explicitly
    paper.view.viewSize = new paper.Size(window.innerWidth, window.innerHeight);

    this.tool = new paper.Tool();
    this.tool.activate(); // 👈 ensures input is enabled

    this.tool.onMouseDown = (event: paper.ToolEvent) => {
      this.path = new paper.Path();
      this.path.strokeColor = new paper.Color('black');
      this.path.strokeWidth = 3;
      this.path.add(event.point);
    };

    this.tool.onMouseDrag = (event: paper.ToolEvent) => {
      this.path.add(event.point);
    };

    this.tool.onMouseUp = () => {
      this.path.smooth();
    };
  }
}
