import { Routes } from '@angular/router';
import { AdminLayout } from './layout/layout';
import { Docente } from './docente/docente';
import { EstudiantesComponent } from './estudiantes/estudiantes';
import { Materias } from './materias/materias';
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
