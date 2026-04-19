import { Routes } from '@angular/router';
import { List } from './robot-types/list/list';
import { Form } from './robot-types/form/form';
import { RobotsList } from './robots/list/list';
import { RobotsForm } from './robots/form/form';

export const routes: Routes = [
  { path: '', redirectTo: 'robot-types', pathMatch: 'full' },

  // Robot Types routes
  { path: 'robot-types', component: List },
  { path: 'robot-types/create', component: Form },
  { path: 'robot-types/:id/edit', component: Form },

  // Robots routes
  { path: 'robots', component: RobotsList },
  { path: 'robots/create', component: RobotsForm },
  { path: 'robots/:id/edit', component: RobotsForm },

  { path: '**', redirectTo: 'robot-types' }, // Fallback to robot-types for any undefined routes
];
