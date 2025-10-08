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
  area?: string; 
}

export interface EstadisticasCarga {
  totalDocentes: number;
}

@Injectable({ 
  providedIn: 'root' 
})
export class AdminDocenteService {
  private apiUrl = `${environment.apiUrl}/carga`;
  private usuariosUrl = `${environment.apiUrl}/users`; 

  readonly ROL_USUARIO = 1;
  readonly ROL_DOCENTE = 2;
  readonly ROL_ADMIN = 3;
  
  constructor(private http: HttpClient) {}
  
  getDocentesCarga(
    termino?: string,
    estado?: string,
    area?: string,
    page: number = 1, 
    limit: number = 10
  ): Observable<DocenteCarga[]> {
    let params = new HttpParams();
    
    // json-server usa filtros simples sin paginación avanzada
    if (estado) params = params.set('estado', estado);
    if (area) params = params.set('area', area);
    
    return this.http.get<DocenteCarga[]>(`${this.apiUrl}`, { params });
  }

  getDocenteCarga(id: number): Observable<DocenteCarga> {
    return this.http.get<DocenteCarga>(`${this.apiUrl}/${id}`);
  }

  getUsuariosRegulares(page = 1, limit = 10): Observable<any[]> {
    // Obtener usuarios que no son admin
    const params = new HttpParams()
      .set('role', 'docente'); // Filtrar por role
    
    return this.http.get<any[]>(`${this.usuariosUrl}`, { params });
  }

  asignarRol(usuarioId: number, rolId: number): Observable<any> {
    // Para mock-api, solo actualizar el rol
    return this.http.patch(`${this.usuariosUrl}/${usuarioId}`, {
      role: rolId === this.ROL_ADMIN ? 'admin' : 'docente'
    });
  }
  
  actualizarDocente(id: number, docente: Partial<DocenteCarga>): Observable<DocenteCarga> {
    return this.http.patch<DocenteCarga>(`${this.apiUrl}/${id}`, docente);
  }

  getEstadisticas(): Observable<EstadisticasCarga> {
    return this.http.get<EstadisticasCarga>(`${this.apiUrl}/estadisticas`);
  }

  asignarMateria(docenteId: number, materiaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${docenteId}/materias/`, { materia_id: materiaId });
  }
}