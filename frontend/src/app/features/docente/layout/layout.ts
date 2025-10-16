import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, AuthUser } from '../../../core/services/services';

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
export class Layout implements OnInit {
  currentUser: AuthUser | null = null;
  userName: string = 'Docente';
  userInitial: string = 'D';

  menuItems = [
    { path: 'estudiantes', label: 'Estudiantes', icon: 'users' },
    { path: 'materias', label: 'Materias', icon: 'book' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('Layout docente - Usuario actual:', user);
      if (user) {
        this.userName = user.name || '';
        this.userInitial = this.getInitials(this.userName || 'Usuario');
        console.log('Layout docente - userName:', this.userName);
        console.log('Layout docente - userInitial:', this.userInitial);
      }
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  irAlHome() {
    this.router.navigate(['/home']);
  }

  volverAlPanel(event: Event) {
    event.preventDefault();
    this.router.navigate(['/docente']);
  }

  cerrarSesion(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
