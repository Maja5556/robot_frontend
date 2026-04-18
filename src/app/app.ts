import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sketch } from './sketch/sketch';

@Component({
  selector: 'app-root',
  imports: [Sketch],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Robot');
}
