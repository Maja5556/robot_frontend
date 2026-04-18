import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RobotType } from './_interfaces/robot-type';
import { Robot } from './_interfaces/robot';

@Injectable({ providedIn: 'root' })
export class ApiService {
  baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getRobotTypes(): Observable<RobotType[]> {
    return this.http.get<RobotType[]>(`${this.baseUrl}/robot-types`);
  }

  getRobotType(id: number): Observable<RobotType> {
    return this.http.get<RobotType>(`${this.baseUrl}/robot-types/${id}`);
  }

  createRobotType(data: RobotType): Observable<RobotType> {
    // Send complete data including sketch
    return this.http.post<RobotType>(`${this.baseUrl}/robot-types`, {
      name: data.name,
      dimensions: data.dimensions,
      sketch: data.sketch || [],
    });
  }

  updateRobotType(id: number, data: RobotType): Observable<RobotType> {
    // Send complete data including sketch
    return this.http.put<RobotType>(`${this.baseUrl}/robot-types/${id}`, {
      name: data.name,
      dimensions: data.dimensions,
      sketch: data.sketch || [],
    });
  }

  deleteRobotType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/robot-types/${id}`);
  }

  saveSketch(id: number, sketch: any): Observable<RobotType> {
    return this.http.put<RobotType>(`${this.baseUrl}/robot-types/${id}/sketch`, {
      sketch,
    });
  }

  getSketch(id: number): Observable<RobotType> {
    return this.http.get<RobotType>(`${this.baseUrl}/robot-types/${id}/sketch`);
  }

  getRobots() {
    return this.http.get(`${this.baseUrl}/robots`);
  }

  createRobot(data: any) {
    return this.http.post(`${this.baseUrl}/robots`, data);
  }
  deleteRobot(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/robots/${id}`);
  }
  getRobot(id: number): Observable<Robot> {
    return this.http.get<Robot>(`${this.baseUrl}/robots/${id}`);
  }
  updateRobot(id: number, data: Robot): Observable<Robot> {
    // Send complete data including sketch
    return this.http.put<Robot>(`${this.baseUrl}/robots/${id}`, {
      name: data.name,
      robotTypeId: data.robotTypeId,
    });
  }
}
