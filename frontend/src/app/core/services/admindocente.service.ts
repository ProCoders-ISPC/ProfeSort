import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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
}

@Injectable({ 
  providedIn: 'root' 
})
export class AdminDocenteService {
  // URL configurada en environment.ts
  private apiUrl = `${environment.apiUrl}/docentes`;

  constructor(private http: HttpClient) {}

  // Obtener todos los docentes - ahora con parámetros de búsqueda
  getDocentesCarga(
    termino?: string,
    estado?: string,
    departamento?: string,
    page: number = 1, 
    limit: number = 10
  ): Observable<DocenteCarga[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    // Agregar parámetros de búsqueda si existen
    if (termino) params = params.set('termino', termino);
    if (estado) params = params.set('estado', estado);
    if (departamento) params = params.set('departamento', departamento);
    
    return this.http.get<DocenteCarga[]>(this.apiUrl, { params });
  }

  // Obtener un docente específico por ID
  getDocenteCarga(id: number): Observable<DocenteCarga> {
    return this.http.get<DocenteCarga>(`${this.apiUrl}/${id}`);
  }

  // Crear nuevo docente
  crearDocente(docente: Partial<DocenteCarga>): Observable<DocenteCarga> {
    return this.http.post<DocenteCarga>(this.apiUrl, docente);
  }

  // Actualizar docente existente
  actualizarDocente(id: number, docente: Partial<DocenteCarga>): Observable<DocenteCarga> {
    return this.http.put<DocenteCarga>(`${this.apiUrl}/${id}`, docente);
  }

  // Eliminar docente
  eliminarDocente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtener estadísticas de docentes
  getEstadisticas(): Observable<EstadisticasCarga> {
    return this.http.get<EstadisticasCarga>(`${this.apiUrl}/estadisticas`);
  }
}