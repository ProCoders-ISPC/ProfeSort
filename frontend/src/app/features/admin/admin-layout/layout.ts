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
  constructor(
    private router: Router
  ) {}

  cerrarSesion() {
    // Eliminar información de sesión
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirigir a la página de login
    this.router.navigate(['/login']);
  }
}
