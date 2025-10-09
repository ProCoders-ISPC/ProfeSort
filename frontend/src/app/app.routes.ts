import { Routes } from '@angular/router';
import { Home } from './features/public/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { About } from './features/public/about/about';
import { ContactComponent } from './features/public/contact/contact';
import { LayoutComponent } from './features/public/layout/layout';
import { JuanpabloSanchez } from './features/public/portfolios/juanpablo-sanchez/juanpablo-sanchez'
import { JuanignacioGioda } from './features/public/portfolios/juanignacio-gioda/juanignacio-gioda';
import { LauraZarateComponent as LauraZarate } from './features/public/portfolios/laura-zarate/laura-zarate.component';
import { DanielPaezComponent } from './features/public/portfolios/daniel-paez/daniel-paez';

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

  { path: 'portfolio/laura-zarate', component: LauraZarate },
  { path: 'portfolio/juanpablo-sanchez', component: JuanpabloSanchez },
  { path: 'portfolio/juanignacio-gioda', component: JuanignacioGioda },
  { path: 'portfolio/daniel-paez', component: DanielPaezComponent },

  // RUTAS ADMIN (lazy loading - se cargará desde admin.routes.ts)
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  // RUTAS DOCENTE (lazy loading - se cargará desde docente.routes.ts)
  {
    path: 'docente',
    loadChildren: () => import('./features/docente/docente.routes').then(m => m.DOCENTE_ROUTES)
  },

  { path: '**', redirectTo: '/home' }
];
