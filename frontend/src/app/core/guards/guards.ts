import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/services';
import { User } from '../models/models';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | boolean {
    //  verificar localStorage
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Validar sesión en BD
    return this.authService.validateSessionInDB().pipe(
      map(isValid => {
        if (isValid) {
          return true;
        } else {
          // Sesión inválida, limpiar y redirigir
          this.authService.logout();
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError(() => {
        // Error al validar, por seguridad desloguear
        this.authService.logout();
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | boolean {
    // Verificar autenticación básica
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Validar sesión en BD y rol de admin
    return this.authService.validateSessionInDB().pipe(
      switchMap(isValid => {
        if (!isValid) {
          this.authService.logout();
          this.router.navigate(['/login']);
          return of(false);
        }

        // Verificar rol de administrador
        if (this.authService.isAdmin()) {
          return of(true);
        } else {
          this.router.navigate(['/home']);
          return of(false);
        }
      }),
      catchError(() => {
        this.authService.logout();
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}



@Injectable({
  providedIn: 'root'
})
export class TeacherGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | boolean {
    // Verificar autenticación básica
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Validar sesión en BD y permisos de docente
    return this.authService.validateSessionInDB().pipe(
      switchMap(isValid => {
        if (!isValid) {
          this.authService.logout();
          this.router.navigate(['/login']);
          return of(false);
        }

        // Verificar si es User o Admin (ambos pueden ser docentes)
        if (this.authService.isUser() || this.authService.isAdmin()) {
          return of(true);
        } else {
          this.router.navigate(['/home']);
          return of(false);
        }
      }),
      catchError(() => {
        this.authService.logout();
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}

// Nuevo guard: InformesGuard
@Injectable({
  providedIn: 'root'
})
export class InformesGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // Solo admins pueden ver informes
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      return true;
    } else if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
      return false;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}