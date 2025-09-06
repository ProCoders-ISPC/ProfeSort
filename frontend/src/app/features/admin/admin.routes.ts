import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout/layout';
import { Docente } from './admin-docente/admindocente';
import { EstudiantesComponent } from './admin-estudiantes/estudiantes';
import { Materias } from './admin-materias/materias';
import { AdminGuard } from '../../core/guards/guards';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    canActivate: [AdminGuard], // 🛡️ Solo admins pueden acceder
    children: [
  { path: 'docentes', component: Docente },
  { path: 'estudiantes', component: EstudiantesComponent },
  { path: 'materias', component: Materias },
  { path: '', redirectTo: 'docentes', pathMatch: 'full' },

    ],
  },
];
