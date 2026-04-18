import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import paper from 'paper';

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

    // IMPORTANT: wait one frame so layout is correct
    requestAnimationFrame(() => {
      this.initPaper(canvas);
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
      console.log('Start point: ', event.point);
    };

    this.tool.onMouseDrag = (event: paper.ToolEvent) => {
      this.path.add(event.point);
      console.log('Dragged to point: ', event.point);
    };

    this.tool.onMouseUp = (event: paper.ToolEvent) => {
      console.log('End point: ', event.point);
      this.path.smooth();
    };
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
