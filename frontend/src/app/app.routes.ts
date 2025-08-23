import { Routes } from '@angular/router';
import { Home } from './features/public/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { About } from './features/public/about/about';
import { Contact } from './features/public/contact/contact';
import { Layout } from './features/public/layout/layout';
//import { PanelEstudiante } from './features/docente/panel-estudiante/panel-estudiante';
//import { PanelMaterias } from './features/docente/panel-materias/panel-materias';
//import { PanelUser } from './features/docente/panel-user/panel-user';
//import { CristianVargas } from './features/public/portfolios/cristian-vargas/cristian-vargas';
//import { DanielPaez } from './features/public/portfolios/daniel-paez/daniel-paez';
//import { JuanignacioGioda } from './features/public/portfolios/juanignacio-gioda/juanignacio-gioda';
//import { JuanpabloSanchez } from './features/public/portfolios/juanpablo-sanchez/juanpablo-sanchez';
import { KarinaQuinterosComponent } from './features/public/portfolios/karina-quinteros/karina-quinteros.component';
//import { LauraZarate } from './features/public/portfolios/laura-zarate/laura-zarate';

export const routes: Routes = [
  { 
    path: '', 
    component: Layout,
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'about', component: About },
      { path: 'contact', component: Contact },
      
      // Portafolios
      //{ path: 'portfolio/cristian-vargas', component: CristianVargas },
      //{ path: 'portfolio/daniel-paez', component: DanielPaez },
      //{ path: 'portfolio/juanignacio-gioda', component: JuanignacioGioda },
      //{ path: 'portfolio/juanpablo-sanchez', component: JuanpabloSanchez },
      { path: 'portfolio/karina-quinteros', component: KarinaQuinterosComponent },
      //{ path: 'portfolio/laura-zarate', component: LauraZarate },
    ]
  },
  
  // Rutas de autenticación (sin layout)
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  
  // Paneles de administración (sin layout por ahora)
  //{ path: 'panel-admin', component: PanelAdmin },
  //{ path: 'panel-admin-gestion', component: PanelAdminGestion },
  //{ path: 'panel-estudiante', component: PanelEstudiante },
  //{ path: 'panel-materias', component: PanelMaterias },
  //{ path: 'panel-user', component: PanelUser },
  
  { path: '**', redirectTo: '/home' } // Ruta wildcard para páginas no encontradas
];
