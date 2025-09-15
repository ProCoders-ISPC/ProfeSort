

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';


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
  private apiUrl = 'http://localhost:3000/materias';

  constructor(private http: HttpClient) {}

  // GET real desde mock-api
  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.apiUrl);
  }

  // POST real al mock-api
  addMateria(materia: Omit<Materia, 'id'>): Observable<Materia> {
    if (!DOCENTES_VALIDOS.includes(materia.profesor)) {
      return throwError(() => new Error('El docente seleccionado no es válido.'));
    }
    return this.http.post<Materia>(this.apiUrl, materia);
  }

  // PUT real al mock-api
  updateMateria(id: number, materia: Partial<Materia>): Observable<Materia> {
    if (materia.profesor && !DOCENTES_VALIDOS.includes(materia.profesor)) {
      return throwError(() => new Error('El docente seleccionado no es válido.'));
    }
    return this.http.put<Materia>(`${this.apiUrl}/${id}`, materia);
  }

  // DELETE real al mock-api
  deleteMateria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
