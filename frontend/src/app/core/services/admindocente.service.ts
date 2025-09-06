import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface DocenteCarga {
  id: number;
  nombre: string;
  email: string;
  legajo: string;
  estado: 'Activo' | 'Inactivo';
  cantidadMaterias: number;
  cantidadEstudiantes: number;
  materias: string[];
  fechaIngreso?: string;
  departamento?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminDocenteService {
  private apiUrl = 'http://localhost:3001/carga';

  constructor(private http: HttpClient) {}

  getDocentesCarga(): Observable<DocenteCarga[]> {
    return this.http.get<DocenteCarga[]>(this.apiUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de conexión: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 0:
          errorMessage = 'No se puede conectar al servidor. Verifique que el mock API esté ejecutándose en el puerto 3001.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Error en AdminDocenteService:', error);
    return throwError(() => new Error(errorMessage));
  }
}