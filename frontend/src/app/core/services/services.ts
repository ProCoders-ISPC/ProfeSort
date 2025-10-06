import { Injectable } from '@angular/core';
import { Docente, User } from '../models/models';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DocentesService {
  private docentes: Docente[] = [
    { id: 1, name: 'Karina Quinteros', email: 'karina@gmail.com', legajo: 'DOC001', estado: 'Activo' },
    { id: 2, name: 'Juan Pablo Sánchez', email: 'juan@gmail.com', legajo: 'DOC002', estado: 'Activo' },
  ];

  getAll(): Docente[] {
    return this.docentes;
  }

  add(docente: Docente) {
    this.docentes.push({ ...docente, id: Date.now() });
  }

  update(id: number, docente: Partial<Docente>) {
    const index = this.docentes.findIndex(d => d.id === id);
    if (index !== -1) {
      this.docentes[index] = { ...this.docentes[index], ...docente };
    }
  }

  delete(id: number) {
    this.docentes = this.docentes.filter(d => d.id !== id);
  }
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  dni: string;
  legajo: string;
  fechaNacimiento: string;
  domicilio: string;
  telefono: string;
  confirmarEmail: string;
  confirmarPassword: string;
  terminos: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: 'Admin' | 'User';
  legajo?: string;
  token: string;
  isLoggedIn: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = 'http://localhost:3000/auth'; // Cambié de /api/auth a /auth
  
  constructor(private http: HttpClient) {
    // Verificar si hay una sesión guardada al inicializar el servicio
    this.loadSavedSession();
  }

  private loadSavedSession(): void {
    const savedUser = localStorage.getItem('currentUser');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('rol');

    if (savedUser && isLoggedIn === 'true') {
      try {
        const user = JSON.parse(savedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        // Si hay error al parsear, limpiar localStorage
        this.clearSession();
      }
    }
  }

  private saveSession(user: AuthUser): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('rol', user.role);
    if (user.token) {
      localStorage.setItem('token', user.token);
    }
  }

  private clearSession(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('rol');
    localStorage.removeItem('token');
  }

  // Login usando la API mock
  login(email: string, password: string): Observable<ApiResponse<AuthUser>> {
    const loginData: LoginRequest = { email, password };
    
    return new Observable<ApiResponse<AuthUser>>(observer => {
      this.http.post<ApiResponse<AuthUser>>(`${this.apiUrl}/login`, loginData)
        .subscribe({
          next: (response) => {
            if (response.success && response.data) {
              // Guardar sesión
              this.saveSession(response.data);
              this.currentUserSubject.next(response.data);
            }
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            console.error('Error en login:', error);
            let errorResponse: ApiResponse<AuthUser>;
            
            if (error.status === 401) {
              errorResponse = {
                success: false,
                message: 'Credenciales inválidas',
                error: 'Email o contraseña incorrectos'
              };
            } else {
              errorResponse = {
                success: false,
                message: 'Error de conexión',
                error: 'No se pudo conectar al servidor'
              };
            }
            
            observer.next(errorResponse);
            observer.complete();
          }
        });
    });
  }

  // Registro usando la API mock
  register(registerData: RegisterRequest): Observable<ApiResponse<any>> {
    return new Observable<ApiResponse<any>>(observer => {
      this.http.post<ApiResponse<any>>(`${this.apiUrl}/register`, registerData)
        .subscribe({
          next: (response) => {
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            console.error('Error en registro:', error);
            let errorResponse: ApiResponse<any>;
            
            if (error.status === 409) {
              errorResponse = {
                success: false,
                message: 'Usuario ya existe',
                error: error.error?.error || 'Ya existe un usuario con estos datos'
              };
            } else {
              errorResponse = {
                success: false,
                message: 'Error de conexión',
                error: 'No se pudo conectar al servidor'
              };
            }
            
            observer.next(errorResponse);
            observer.complete();
          }
        });
    });
  }

  // Logout
  logout(): void {
    this.clearSession();
    this.currentUserSubject.next(null);
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    const currentUser = this.currentUserSubject.value;
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return currentUser !== null && isLoggedIn;
  }

  // Verificar si es administrador
  isAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    const role = localStorage.getItem('rol');
    return currentUser !== null && (currentUser.role === 'Admin' || role === 'Admin') && this.isAuthenticated();
  }

  // Verificar si es docente/usuario
  isUser(): boolean {
    const currentUser = this.currentUserSubject.value;
    const role = localStorage.getItem('rol');
    return currentUser !== null && (currentUser.role === 'User' || role === 'User') && this.isAuthenticated();
  }
  
  // Obtener usuario actual
  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  // Obtener datos de sesión del localStorage (para compatibilidad)
  getSessionData() {
    return {
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
      rol: localStorage.getItem('rol') as 'Admin' | 'User' | null,
      user: this.getCurrentUser()
    };
  }

  // Validar sesión en base de datos
  validateSessionInDB(): Observable<boolean> {
    const currentUser = this.getCurrentUser();
    const token = localStorage.getItem('token');
    
    if (!currentUser || !token) {
      return of(false);
    }

    // Consultar la API para verificar si el usuario sigue activo
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/validate-session`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(response => response.success && response.data?.isActive === true),
      catchError(() => of(false))
    );
  }
}
