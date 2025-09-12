import { Routes } from '@angular/router';
import { Layout as DocenteLayout } from './layout/layout';
import { Estudiantes } from './estudiantes/estudiantes';
import { Materias } from './materias/materias';
import { TeacherGuard } from '../../core/guards/guards';

export const DOCENTE_ROUTES: Routes = [
  {
    path: '',
    component: DocenteLayout,
    //canActivate: [TeacherGuard], // 🛡️ Solo docentes pueden acceder
    children: [
      { path: 'estudiantes', component: Estudiantes },
      { path: 'materias', component: Materias },
      { path: '', redirectTo: 'estudiantes', pathMatch: 'full' }
    ]
  }
];