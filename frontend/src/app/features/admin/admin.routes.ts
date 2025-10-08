import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout/layout';
import { AdminDocenteComponent } from './admin-docente/admindocente';
import { EstudiantesComponent } from './admin-estudiantes/estudiantes';
import { Materias } from './admin-materias/materias';
import { AdminGuard } from '../../core/guards/guards';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    canActivate: [AdminGuard], 
    children: [
    { path: '', loadComponent: () => import('./inicio/inicio').then(m => m.AdminInicio) },
    { path: 'docentes', component: AdminDocenteComponent },
    { path: 'estudiantes', component: EstudiantesComponent },
    { path: 'materias', component: Materias },
    { path: 'informes', loadComponent: () => import('./informes/informes').then(m => m.InformesComponent) }
    ],
  },
];
