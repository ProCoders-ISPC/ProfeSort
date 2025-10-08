import { Component, HostListener } from '@angular/core';
import { RouterModule, Router, NavigationStart } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-docente-layout',
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class Layout {
  menuItems = [
    { path: 'estudiantes', label: 'Estudiantes', icon: 'users' },
    { path: 'materias', label: 'Materias', icon: 'book' }
  ];

  constructor(private router: Router) {}

  sidebarOpen: boolean = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768 && this.sidebarOpen) {
      this.closeSidebar();
    }
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}