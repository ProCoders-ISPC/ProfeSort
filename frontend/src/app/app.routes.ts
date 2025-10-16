import { Routes } from '@angular/router';
import { Home } from './features/public/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { About } from './features/public/about/about';
import { ContactComponent } from './features/public/contact/contact';
import { LayoutComponent } from './features/public/layout/layout';


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



  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },


  {
    path: 'docente',
    loadChildren: () => import('./features/docente/docente.routes').then(m => m.DOCENTE_ROUTES)
  },

  { path: '**', redirectTo: '/home' }
];
