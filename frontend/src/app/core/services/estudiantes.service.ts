import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Estudiante {
  legajo: any;
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  email: string;
  estado: string;
  docenteId?: number;
}

export interface EstudianteCrear {
  nombre: string;
  apellidos: string;
  dni: string;
  email: string;
  estado: string;
  docenteId: number;
}

export interface ErrorValidacion {
  field: string;
  message: string;
}

export interface ErrorResponse {
  message: string;
  errors?: ErrorValidacion[];
}

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {
  private apiUrl = environment.apiUrl + '/estudiantes';

  constructor(private http: HttpClient) {}

  /**
   * Obtener el listado completo de estudiantes
   */
  getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener estudiantes asignados a un docente específico
   */
  getEstudiantesByDocenteId(docenteId: number): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.apiUrl}/docente/${docenteId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener un estudiante por su ID
   */
  getEstudianteById(id: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crear un nuevo estudiante
   */
  crearEstudiante(data: EstudianteCrear): Observable<Estudiante> {
    return this.http.post<Estudiante>(this.apiUrl, data).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar un estudiante existente
   */
  actualizarEstudiante(id: number, data: Partial<Estudiante>): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${this.apiUrl}/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar un estudiante
   */
  eliminarEstudiante(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo centralizado de errores HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorResponse: ErrorResponse;

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente (red, etc.)
      errorResponse = {
        message: `Error de conexión: ${error.error.message}`,
        errors: []
      };
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 400:
          // Errores de validación
          errorResponse = {
            message: error.error?.message || 'Datos inválidos',
            errors: error.error?.errors || []
          };
          break;
        case 404:
          errorResponse = {
            message: 'Estudiante no encontrado',
            errors: []
          };
          break;
        case 409:
          errorResponse = {
            message: 'El estudiante ya existe o hay un conflicto',
            errors: error.error?.errors || []
          };
          break;
        case 500:
          errorResponse = {
            message: 'Error interno del servidor',
            errors: []
          };
          break;
        default:
          errorResponse = {
            message: `Error ${error.status}: ${error.message}`,
            errors: []
          };
      }
    }

    return throwError(() => errorResponse);
  }

  /**
   * Formatear errores de validación para mostrar en la UI
   */
  formatearErroresValidacion(errors: ErrorValidacion[]): string {
    if (!errors || errors.length === 0) {
      return '';
    }
    
    return errors.map(error => `${error.field}: ${error.message}`).join('\n');
  }
}