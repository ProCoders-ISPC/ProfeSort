import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
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

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}