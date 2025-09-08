import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

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

export interface EstadisticasCarga {
  totalDocentes: number;
  docentesActivos: number;
  docentesInactivos: number;
  totalMaterias: number;
  totalEstudiantes: number;
  promedioMateriasActivos: number;
  promedioEstudiantesActivos: number;
}

@Injectable({ 
  providedIn: 'root' 
})
export class AdminDocenteService {
  private baseUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la información de carga de todos los docentes
   */
  getDocentesCarga(): Observable<DocenteCarga[]> {
    return this.http.get<DocenteCarga[]>(`${this.baseUrl}/carga`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene estadísticas calculadas de carga docente
   */
  getEstadisticasCarga(): Observable<EstadisticasCarga> {
    return this.getDocentesCarga().pipe(
      map(docentes => this.calcularEstadisticas(docentes)),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene la carga de un docente específico
   */
  getDocenteCarga(id: number): Observable<DocenteCarga> {
    return this.http.get<DocenteCarga>(`${this.baseUrl}/carga/${id}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * Calcula estadísticas a partir de los datos de carga
   */
  private calcularEstadisticas(docentes: DocenteCarga[]): EstadisticasCarga {
    const totalDocentes = docentes.length;
    const docentesActivos = docentes.filter(d => d.estado === 'Activo');
    const docentesInactivos = docentes.filter(d => d.estado === 'Inactivo');
    
    const totalMaterias = docentes.reduce((sum, d) => sum + d.cantidadMaterias, 0);
    const totalEstudiantes = docentes.reduce((sum, d) => sum + d.cantidadEstudiantes, 0);
    
    const totalMateriasActivos = docentesActivos.reduce((sum, d) => sum + d.cantidadMaterias, 0);
    const totalEstudiantesActivos = docentesActivos.reduce((sum, d) => sum + d.cantidadEstudiantes, 0);

    return {
      totalDocentes,
      docentesActivos: docentesActivos.length,
      docentesInactivos: docentesInactivos.length,
      totalMaterias,
      totalEstudiantes,
      promedioMateriasActivos: docentesActivos.length > 0 ? 
        Math.round((totalMateriasActivos / docentesActivos.length) * 100) / 100 : 0,
      promedioEstudiantesActivos: docentesActivos.length > 0 ? 
        Math.round((totalEstudiantesActivos / docentesActivos.length) * 100) / 100 : 0
    };
  }

  /**
   * Manejo centralizado de errores HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error de conexión: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 0:
          errorMessage = 'No se puede conectar al servidor. Verifique que el mock API esté ejecutándose en el puerto 3001.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado. Verifique que el endpoint de carga esté disponible.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Intente nuevamente más tarde.';
          break;
        case 503:
          errorMessage = 'Servicio no disponible temporalmente.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message || 'Error del servidor'}`;
      }
    }
    
    console.error('Error en AdminDocenteService:', {
      status: error.status,
      message: error.message,
      url: error.url,
      error: error.error
    });
    
    return throwError(() => new Error(errorMessage));
  }
}