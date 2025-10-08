import { Injectable } from '@angular/core';
import { Docente, User } from '../models/models';
import { BehaviorSubject, Observable,} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


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
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = 'http://localhost:3000/auth';
  
  constructor(private http: HttpClient) {
    this.loadSavedSession();
  }

  private loadSavedSession(): void {
    const savedUser = sessionStorage.getItem('currentUser');

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.clearSession();
      }
    }
  }

  private saveSession(user: AuthUser): void {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  private clearSession(): void {
    sessionStorage.removeItem('currentUser');
  }

  login(email: string, password: string): Observable<ApiResponse<AuthUser>> {
    const loginData: LoginRequest = { email, password };
    
    return new Observable<ApiResponse<AuthUser>>(observer => {
      this.http.post<ApiResponse<AuthUser>>(`${this.apiUrl}/login`, loginData)
        .subscribe({
          next: (response) => {
            if (response.success && response.data) {
              this.saveSession(response.data);
              this.currentUserSubject.next(response.data);
            }
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
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

  register(registerData: RegisterRequest): Observable<ApiResponse<any>> {
    return new Observable<ApiResponse<any>>(observer => {
      this.http.post<ApiResponse<any>>(`${this.apiUrl}/register`, registerData)
        .subscribe({
          next: (response) => {
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
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

  logout(): void {
    this.clearSession();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser !== null && currentUser.role === 'Admin';
  }

  isUser(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser !== null && currentUser.role === 'User';
  }
  
  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  getSessionData() {
    const user = this.getCurrentUser();
    return {
      isLoggedIn: user !== null,
      rol: user?.role || null,
      user: user
    };
  }
}
