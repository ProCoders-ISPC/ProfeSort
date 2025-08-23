import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/services';

// 🔐 AuthGuard: Verifica si el usuario está logueado
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // Pregunta al AuthService: "¿está el usuario logueado?"
    if (this.authService.isAuthenticated()) {
      return true; // ✅ Sí está logueado, puede pasar
    } else {
      // ❌ No está logueado, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }
  }
}

// 👑 AdminGuard: Verifica si el usuario es administrador
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // Pregunta al AuthService: "¿está logueado Y es admin?"
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      return true; // ✅ Sí es admin, puede pasar
    } else if (this.authService.isAuthenticated()) {
      // ❌ Está logueado pero no es admin, redirigir a home
      this.router.navigate(['/home']);
      return false;
    } else {
      // ❌ No está logueado, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
