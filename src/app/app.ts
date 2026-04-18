import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sketch } from './sketch/sketch';
import { List } from './robot-types/list/list';

@Component({
  selector: 'app-root',
  imports: [Sketch, RouterOutlet, List],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Robot');
}
