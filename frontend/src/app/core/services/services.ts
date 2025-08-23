import { Injectable } from '@angular/core';
import { Docente, User } from '../models/models';
import { BehaviorSubject } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Estado del usuario actual (null = no logueado)
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Usuarios de prueba (en una app real vendrían de una base de datos)
  private users: User[] = [
    { id: 1, email: 'admin@profesort.com', name: 'Administrador', role: 'admin', isLoggedIn: false },
    { id: 2, email: 'karina@profesort.com', name: 'Karina Quinteros', role: 'teacher', isLoggedIn: false },
    { id: 3, email: 'estudiante@profesort.com', name: 'Juan Estudiante', role: 'student', isLoggedIn: false }
  ];

  constructor() {
    // Al iniciar, verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.currentUserSubject.next(user);
    }
  }

  // Método para hacer login
  login(email: string, password: string): boolean {
    // Buscar el usuario por email (en una app real verificarías la contraseña)
    const user = this.users.find(u => u.email === email);
    
    if (user) {
      // Marcar como logueado
      user.isLoggedIn = true;
      
      // Guardar en localStorage para persistir la sesión
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Actualizar el estado
      this.currentUserSubject.next(user);
      
      return true; // Login exitoso
    }
    
    return false; // Login fallido
  }

  // Método para hacer logout
  logout(): void {
    // Limpiar localStorage
    localStorage.removeItem('currentUser');
    
    // Actualizar estado a null (no logueado)
    this.currentUserSubject.next(null);
  }

  // Verificar si el usuario está logueado
  isAuthenticated(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser !== null && currentUser.isLoggedIn;
  }

  // Verificar si el usuario es administrador
  isAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser !== null && currentUser.role === 'admin' && currentUser.isLoggedIn;
  }

  // Obtener el usuario actual
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
