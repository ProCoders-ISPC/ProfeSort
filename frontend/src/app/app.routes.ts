import { Routes } from '@angular/router';
import { Home } from './features/public/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { About } from './features/public/about/about';
import { Contact } from './features/public/contact/contact';
import { Layout } from './features/public/layout/layout';
import { KarinaQuinteros } from './features/public/portfolios/karina-quinteros/karina-quinteros.component';
import { JuanpabloSanchez } from './features/public/portfolios/juanpablo-sanchez/juanpablo-sanchez'
import { JuanignacioGioda } from './features/public/portfolios/juanignacio-gioda/juanignacio-gioda';
import { Estudiantes } from './features/docente/estudiantes/estudiantes';
import { LauraZarateComponent as LauraZarate } from './features/public/portfolios/laura-zarate/laura-zarate.component';
// import { CristianVargas } from './features/public/portfolios/cristian-vargas/cristian-vargas';
// import { DanielPaez } from './features/public/portfolios/daniel-paez/daniel-paez';


export const routes: Routes = [
  
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'about', component: About },
      { path: 'contact', component: Contact },
    ]
  },

  
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  
  { path: 'portfolio/karina-quinteros', component: KarinaQuinteros },
  { path: 'portfolio/laura-zarate', component: LauraZarate },
  { path: 'portfolio/juanpablo-sanchez', component: JuanpabloSanchez },
  { path: 'portfolio/juanignacio-gioda', component: JuanignacioGioda },

  // Rutas del docente
  { 
    path: 'docente', 
    children: [
      { path: 'estudiantes', component: Estudiantes },
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
