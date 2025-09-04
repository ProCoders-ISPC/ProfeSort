
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Materia {
  id: number;
  nombre: string;
  codigo: string;
  profesor: string;
}

@Injectable({ providedIn: 'root' })
export class MateriasService {
  // Datos mock para simular materias
  private mockMaterias: Materia[] = [
    { id: 1, nombre: 'Matemática', codigo: 'MAT101', profesor: 'Prof. Juan Pérez' },
    { id: 2, nombre: 'Lengua', codigo: 'LEN201', profesor: 'Prof. Ana Gómez' },
    { id: 3, nombre: 'Historia', codigo: 'HIS301', profesor: 'Prof. Carlos Ruiz' }
  ];

  getMaterias(): Observable<Materia[]> {
    return of(this.mockMaterias);
  }

  addMateria(materia: Omit<Materia, 'id'>): Observable<Materia> {
    const nueva: Materia = { ...materia, id: Date.now() } as Materia;
    this.mockMaterias.push(nueva);
    return of(nueva);
  }

  updateMateria(id: number, materia: Partial<Materia>): Observable<Materia> {
    const idx = this.mockMaterias.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.mockMaterias[idx] = { ...this.mockMaterias[idx], ...materia };
      return of(this.mockMaterias[idx]);
    }
    return of(undefined as any);
  }

  deleteMateria(id: number): Observable<void> {
    this.mockMaterias = this.mockMaterias.filter(m => m.id !== id);
    return of();
  }
}
