
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface DocenteSimple {
  id: number;
  name: string;
  legajo: string;
  dni?: string;
  email: string;
}


export interface Materia {
  id: number;
  nombre: string;
  codigo: string;
  docenteId?: number | null;
  docenteNombre?: string | null;
  docenteLegajo?: string | null;
  docenteDni?: string | null;
  descripcion?: string;
  creditos?: number;
}

@Injectable({ providedIn: 'root' })
export class MateriasService {
  private apiUrl = 'http://localhost:3000/materias';
  private usersUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.apiUrl);
  }

  getMateriasByDocente(docenteId: number): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrl}?docenteId=${docenteId}`);
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

  asignarDocente(materiaId: number, docenteId: number | null, docenteData: any): Observable<Materia> {
    const updateData = docenteId ? {
      docenteId,
      docenteNombre: docenteData.name,
      docenteLegajo: docenteData.legajo,
      docenteDni: docenteData.dni
    } : {
      docenteId: null,
      docenteNombre: null,
      docenteLegajo: null,
      docenteDni: null
    };
    return this.http.patch<Materia>(`${this.apiUrl}/${materiaId}`, updateData);
  }

  getDocentes(): Observable<DocenteSimple[]> {
    return this.http.get<DocenteSimple[]>(`${this.usersUrl}?role=User`);
  }
}
