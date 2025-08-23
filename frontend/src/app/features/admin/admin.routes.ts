import { Routes } from '@angular/router';
import { AdminLayout } from './layout/layout';
import { Docente } from './docente/docente';
import { Estudiantes } from './estudiantes/estudiantes';
import { Materias } from './materias/materias';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: 'docentes', component: Docente },
      { path: 'estudiantes', component: Estudiantes },
      { path: 'materias', component: Materias },
      { path: '', redirectTo: 'docentes', pathMatch: 'full' },
      
    ],
  },
];