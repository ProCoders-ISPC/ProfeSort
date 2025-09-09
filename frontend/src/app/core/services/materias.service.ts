

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { delay, map } from 'rxjs/operators';


export interface Materia {
  id: number;
  nombre: string;
  codigo: string;
  profesor: string;
}

// Docentes simulados (puedes obtenerlos de DocentesService si lo prefieres)
const DOCENTES_VALIDOS = [
  'Prof. Juan Pérez',
  'Prof. Ana Gómez',
  'Prof. Carlos Ruiz'
];


@Injectable({ providedIn: 'root' })
export class MateriasService {
  private mockMaterias: Materia[] = [
    { id: 1, nombre: 'Matemática', codigo: 'MAT101', profesor: 'Prof. Juan Pérez' },
    { id: 2, nombre: 'Lengua', codigo: 'LEN201', profesor: 'Prof. Ana Gómez' },
    { id: 3, nombre: 'Historia', codigo: 'HIS301', profesor: 'Prof. Carlos Ruiz' }
  ];

  constructor(private http: HttpClient) {}

  // Simulación GET
  getMaterias(): Observable<Materia[]> {
    // Simula llamada a API y delay
    return of(this.mockMaterias).pipe(delay(400));
  }

  // Simulación POST con validación de docente
  addMateria(materia: Omit<Materia, 'id'>): Observable<Materia> {
    if (!DOCENTES_VALIDOS.includes(materia.profesor)) {
      return throwError(() => new Error('El docente seleccionado no es válido.'));
    }
    const nueva: Materia = { ...materia, id: Date.now() };
    this.mockMaterias.push(nueva);
    // Simula llamada a API y delay
    return of(nueva).pipe(delay(400));
  }

  // Simulación PUT con validación de docente
  updateMateria(id: number, materia: Partial<Materia>): Observable<Materia> {
    const idx = this.mockMaterias.findIndex(m => m.id === id);
    if (idx === -1) return throwError(() => new Error('Materia no encontrada.'));
    if (materia.profesor && !DOCENTES_VALIDOS.includes(materia.profesor)) {
      return throwError(() => new Error('El docente seleccionado no es válido.'));
    }
    this.mockMaterias[idx] = { ...this.mockMaterias[idx], ...materia };
    // Simula llamada a API y delay
    return of(this.mockMaterias[idx]).pipe(delay(400));
  }

  // Simulación DELETE
  deleteMateria(id: number): Observable<void> {
    this.mockMaterias = this.mockMaterias.filter(m => m.id !== id);
    // Simula llamada a API y delay
    return of(undefined).pipe(delay(400));
  }
}
