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
  private apiUrl = `${environment.apiUrl}/docentes`;
  private usuariosUrl = `${environment.apiUrl}/usuarios`; 

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
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (termino) params = params.set('termino', termino);
    if (estado) params = params.set('estado', estado);
    if (area) params = params.set('area', area);
    
    return this.http.get<DocenteCarga[]>(`${this.apiUrl}/`, { params });
  }

  getDocenteCarga(id: number): Observable<DocenteCarga> {
    return this.http.get<DocenteCarga>(`${this.apiUrl}/${id}`);
  }

  getUsuariosRegulares(page = 1, limit = 10): Observable<any[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('role_id', this.ROL_USUARIO.toString());
    
    return this.http.get<any[]>(`${this.usuariosUrl}`, { params });
  }

  asignarRol(usuarioId: number, rolId: number): Observable<any> {
    return this.http.patch(`${this.usuariosUrl}/${usuarioId}/`, {
      role_id: rolId
    });
  }
  
  actualizarDocente(id: number, docente: Partial<DocenteCarga>): Observable<DocenteCarga> {
    return this.http.put<DocenteCarga>(`${this.apiUrl}/${id}`, docente);
  }

  getEstadisticas(): Observable<EstadisticasCarga> {
    return this.http.get<EstadisticasCarga>(`${this.apiUrl}/estadisticas`);
  }

  asignarMateria(docenteId: number, materiaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${docenteId}/materias/`, { materia_id: materiaId });
  }
}