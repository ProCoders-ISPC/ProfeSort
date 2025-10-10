import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Docente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  domicilio: string;
  email: string;
  legajo: string;
  telefono?: string;
  fechaNacimiento?: string;
  fechaIngreso?: string;
  area?: string;
  departamento?: string;
  estado?: string;
}

export interface Estudiante {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  email: string;
  estado: string;
  docenteId: number;
}

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  private apiUrl = environment.apiUrl + '/usuarios';
  // private estudiantesUrl = environment.apiUrl + '/estudiantes'; // Módulo desactivado

  constructor(private http: HttpClient) {}

  getCurrentUser() {
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // Obtener datos del docente por ID
  getDocenteById(id: number): Observable<Docente> {
    return this.http.get<Docente>(`${this.apiUrl}/${id}/`);
  }

  // Actualizar datos del docente
  updateDocente(id: number, docente: Partial<Docente>): Observable<Docente> {
    const url = `${this.apiUrl}/${id}/`;
    return this.http.put<Docente>(url, docente).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener estudiantes asignados a un docente (Módulo desactivado)
  getEstudiantesByDocenteId(docenteId: number): Observable<Estudiante[]> {
    // return this.http.get<Estudiante[]>(`${this.estudiantesUrl}/?docenteId=${docenteId}`).pipe(
    //   catchError(this.handleError)
    // );
    return of([]); // Retornar array vacío - módulo desactivado
  }

  private handleError(error: HttpErrorResponse) {
    // Puedes personalizar el manejo de errores aquí
    let errorMsg = 'Ocurrió un error inesperado.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMsg = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMsg = `Error ${error.status}: ${error.message}`;
    }
    return throwError(() => new Error(errorMsg));
  }
}
