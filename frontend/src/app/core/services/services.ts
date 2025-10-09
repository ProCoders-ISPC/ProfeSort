import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

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
  name: string; 
  email: string;
  role_id: number;
  legajo: string;
  dni: string;
  fecha_nacimiento: string;
  domicilio: string;
  telefono: string;
  area: string;
  fecha_ingreso: string;
  is_active: boolean;
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
        
        
        const authUser: AuthUser = {
          id: user.id || user.id_usuario || 0,
          name: user.name || `${user.nombre || ''} ${user.apellido || ''}`.trim() || '',
          email: user.email || '',
          role_id: user.role_id || (user.role === 'Admin' ? 1 : 2),
          legajo: user.legajo || '',
          dni: user.dni || '',
          fecha_nacimiento: user.fecha_nacimiento || user.fechaNacimiento || '',
          domicilio: user.domicilio || '',
          telefono: user.telefono || '',
          area: user.area || '',
          fecha_ingreso: user.fecha_ingreso || user.createdAt || '',
          is_active: user.is_active !== undefined ? user.is_active : (user.isActive || true)
        };
        
        this.currentUserSubject.next(authUser);
      } catch (error) {
        console.error('Error al cargar sesión:', error);
        this.clearSession();
      }
    }
  }

  private saveSession(user: AuthUser): void {
    
    const normalizedUser: AuthUser = {
      id: user.id || (user as any).id_usuario || 0,
      name: user.name || '',
      email: user.email || '',
      role_id: user.role_id || 2,
      legajo: user.legajo || '',
      dni: user.dni || '',
      fecha_nacimiento: user.fecha_nacimiento || '',
      domicilio: user.domicilio || '',
      telefono: user.telefono || '',
      area: user.area || '',
      fecha_ingreso: user.fecha_ingreso || '',
      is_active: user.is_active !== undefined ? user.is_active : true
    };
    
    sessionStorage.setItem('currentUser', JSON.stringify(normalizedUser));
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
    return currentUser !== null && currentUser.role_id === 1;
  }

  isUser(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser !== null && currentUser.role_id === 2;
  }
  
  getCurrentUser(): AuthUser | null {
    const user = this.currentUserSubject.value;
    if (!user) return null;
    
    
    return {
      id: user.id || (user as any).id_usuario || 0,
      name: user.name || '',
      email: user.email || '',
      role_id: user.role_id || 2,
      legajo: user.legajo || '',
      dni: user.dni || '',
      fecha_nacimiento: user.fecha_nacimiento || '',
      domicilio: user.domicilio || '',
      telefono: user.telefono || '',
      area: user.area || '',
      fecha_ingreso: user.fecha_ingreso || '',
      is_active: user.is_active !== undefined ? user.is_active : true
    };
  }

  getSessionData() {
    const user = this.getCurrentUser();
    return {
      isLoggedIn: user !== null,
      rol: user?.role_id === 1 ? 'Admin' : 'User',
      user: user
    };
  }

  
  refreshUserSession(): void {
    this.loadSavedSession();
  }

 
  validateSession(): Observable<boolean> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return new Observable(observer => {
        observer.next(false);
        observer.complete();
      });
    }

    return this.http.get<{success: boolean, data: any}>(`${this.apiUrl}/validate-session/${currentUser.id}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            
            this.saveSession(response.data);
            return true;
          } else {
            
            this.clearSession();
            return false;
          }
        }),
        catchError(() => {
      
          this.clearSession();
          return of(false);
        })
      );
  }
}
