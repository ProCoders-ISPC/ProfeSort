import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
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
}
