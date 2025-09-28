

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';


export interface Materia {
  id: number;
  nombre: string;
  codigo: string;
  profesor?: string;
}

@Injectable({ providedIn: 'root' })
export class MateriasService {
  private apiUrl = 'http://localhost:3000/materias';

  constructor(private http: HttpClient) {}

  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.apiUrl);
  }

  addMateria(materia: Omit<Materia, 'id'>): Observable<Materia> {
    return this.http.post<Materia>(this.apiUrl, materia);
  }

  updateMateria(id: number, materia: Partial<Materia>): Observable<Materia> {
    return this.http.put<Materia>(`${this.apiUrl}/${id}`, materia);
  }

  deleteMateria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
