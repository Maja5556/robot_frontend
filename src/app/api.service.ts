import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getRobotTypes() {
    return this.http.get<any[]>(`${this.baseUrl}/robot-types`);
  }

  getRobotType(id: number) {
    return this.http.get(`${this.baseUrl}/robot-types/${id}`);
  }

  createRobotType(data: any) {
    return this.http.post(`${this.baseUrl}/robot-types`, data);
  }

  updateRobotType(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/robot-types/${id}`, data);
  }

  deleteRobotType(id: number) {
    return this.http.delete(`${this.baseUrl}/robot-types/${id}`);
  }

  saveSketch(id: number, sketch: any) {
    return this.http.put(`${this.baseUrl}/robot-types/${id}/sketch`, {
      sketch,
    });
  }

  getSketch(id: number) {
    return this.http.get(`${this.baseUrl}/robot-types/${id}/sketch`);
  }

  getRobots() {
    return this.http.get(`${this.baseUrl}/robots`);
  }

  createRobot(data: any) {
    return this.http.post(`${this.baseUrl}/robots`, data);
  }
}
