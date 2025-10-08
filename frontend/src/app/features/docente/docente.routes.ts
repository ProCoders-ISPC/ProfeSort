import { Routes } from '@angular/router';
import { Layout as DocenteLayout } from './layout/layout';
import { Estudiantes } from './estudiantes/estudiantes';
import { Materias } from './materias/materias';
import { TeacherGuard } from '../../core/guards/guards';

export const DOCENTE_ROUTES: Routes = [
  {
    path: '',
    component: DocenteLayout,
    children: [
      { path: '', loadComponent: () => import('./inicio/inicio').then(m => m.DocenteInicio) },
      { path: 'estudiantes', component: Estudiantes },
      { path: 'materias', component: Materias },
      { path: 'perfil', loadComponent: () => import('./perfil/perfil').then(m => m.DocentePerfil) }
    ]
  }
];