import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, ReactiveFormsModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class AdminLayout {
  sidebarOpen = false;
  constructor(
    private router: Router
  ) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/login']);
  }
}
