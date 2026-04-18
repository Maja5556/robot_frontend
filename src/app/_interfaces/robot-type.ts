import { Point } from './point';

export interface RobotType {
  id: number;
  name: string;
  dimensions: string;
  sketch: Point[];
}
