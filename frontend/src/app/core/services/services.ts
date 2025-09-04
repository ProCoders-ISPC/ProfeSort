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
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  
  private users: User[] = [
    { id: 1, email: 'admin@profesort.com', name: 'Administrador', role: 'admin', isLoggedIn: false },
    { id: 2, email: 'karina@profesort.com', name: 'Karina Quinteros', role: 'teacher', isLoggedIn: false },
    { id: 3, email: 'estudiante@profesort.com', name: 'Juan Estudiante', role: 'student', isLoggedIn: false }
  ];

  constructor() {
    
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.currentUserSubject.next(user);
    } else {
   
      const adminUser = this.users.find(u => u.role === 'admin');
      if (adminUser) {
        adminUser.isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        this.currentUserSubject.next(adminUser);
      }
    }
  }

  
  login(email: string, password: string): boolean {
    
    const user = this.users.find(u => u.email === email);

    if (user) {
     
      user.isLoggedIn = true;

     
      localStorage.setItem('currentUser', JSON.stringify(user));

      
      this.currentUserSubject.next(user);

      return true; 
    }

    return false; 
  }

  
  logout(): void {
   
    localStorage.removeItem('currentUser');

    
    this.currentUserSubject.next(null);
  }

  
  isAuthenticated(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser !== null && currentUser.isLoggedIn;
  }

  
  isAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser !== null && currentUser.role === 'admin' && currentUser.isLoggedIn;
  }

  
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
