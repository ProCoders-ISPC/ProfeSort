import { Routes } from '@angular/router';
import { Home } from './features/public/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { About } from './features/public/about/about';
import { ContactComponent } from './features/public/contact/contact';
import { LayoutComponent } from './features/public/layout/layout';
import { KarinaQuinteros } from './features/public/portfolios/karina-quinteros/karina-quinteros.component';
import { JuanpabloSanchez } from './features/public/portfolios/juanpablo-sanchez/juanpablo-sanchez'
import { JuanignacioGioda } from './features/public/portfolios/juanignacio-gioda/juanignacio-gioda';
import { Estudiantes } from './features/docente/estudiantes/estudiantes';
import { Materias } from './features/docente/materias/materias';
import { LauraZarateComponent as LauraZarate } from './features/public/portfolios/laura-zarate/laura-zarate.component';
// import { CristianVargas } from './features/public/portfolios/cristian-vargas/cristian-vargas';
import { DanielPaezComponent } from './features/public/portfolios/daniel-paez/daniel-paez';
import { TeacherGuard } from './core/guards/guards';
import { Layout as DocenteLayout } from './features/docente/layout/layout';


export const routes: Routes = [
  
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'about', component: About },
      { path: 'contact', component: ContactComponent },
    ]
  },

  
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'portfolio/karina-quinteros', component: KarinaQuinteros },
  { path: 'portfolio/laura-zarate', component: LauraZarate },
  { path: 'portfolio/juanpablo-sanchez', component: JuanpabloSanchez },
  { path: 'portfolio/juanignacio-gioda', component: JuanignacioGioda },
  { path: 'portfolio/daniel-paez', component: DanielPaezComponent },
  { path: 'portfolio/juanignacio-gioda', component: JuanignacioGioda },

  // Ruta padre protegida por guard
  {
    path: 'docente',
    component: DocenteLayout,
    canActivate: [TeacherGuard],
    redirectTo: 'docente/estudiantes'
  },
  
  // Rutas hijas de docente sin guard (ya están protegidas por la ruta padre)
  {
    path: 'docente',
    component: DocenteLayout,
    children: [
      { path: 'estudiantes', component: Estudiantes },
      { path: 'materias', component: Materias },
      { path: '', redirectTo: 'estudiantes', pathMatch: 'full' }
    ]
  },

  //  RUTAS ADMIN (lazy loading - se cargará desde admin.routes.ts)
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  { path: '**', redirectTo: '/home' }
];
