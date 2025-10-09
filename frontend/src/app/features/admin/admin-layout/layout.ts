import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, AuthUser } from '../../../core/services/services';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class AdminLayout implements OnInit {
  currentUser: AuthUser | null = null;
  userName: string = 'Administrador';
  userInitial: string = 'A';
  sidebarOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.userName = user.id_rol === 1 ? 'Administrador' : user.name;
        this.userInitial = this.getInitials(this.userName);
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

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  irAlHome() {
    this.router.navigate(['/home']);
  }

  volverAlPanel(event: Event) {
    event.preventDefault();
    this.router.navigate(['/admin']);
  }

  cerrarSesion(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
