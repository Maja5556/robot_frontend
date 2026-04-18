import { Component } from '@angular/core';
import { RobotType } from '../../_interfaces/robot-type';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-list',
  imports: [],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List {
  robotType: RobotType = {
    id: 0,
    name: '',
    dimensions: '',
    sketch: [],
  };

  constructor(private api: ApiService) {}

  addRobotType() {
    this.api.createRobotType(this.robotType).subscribe((response) => {
      console.log('Robot type created:', response);
      // Optionally, reset the form or update the list of robot types
    });
  }
}
