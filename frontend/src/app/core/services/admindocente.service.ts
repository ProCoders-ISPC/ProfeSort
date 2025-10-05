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

  constructor(private http: HttpClient) {}

  // Obtener todos los docentes
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
      
    if (termino) params = params.set('termino', termino);
    if (estado) params = params.set('estado', estado);
    if (departamento) params = params.set('departamento', departamento);
    
    return this.http.get<DocenteCarga[]>(`${this.apiUrl}`, { params });
  }

  // Obtener un docente específico por ID
  getDocenteCarga(id: number): Observable<DocenteCarga> {
    return this.http.get<DocenteCarga>(`${this.apiUrl}/${id}`);
  }

  // Obtener usuarios con rol normal (para convertirlos a docentes)
  getUsuariosRegulares(page = 1, limit = 10): Observable<any[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('role_id', '1'); // ID del rol "usuario regular"
    
    return this.http.get<any[]>(`${this.usuariosUrl}`, { params });
  }

  // Cambiar rol de un usuario a docente
  asignarRolDocente(usuarioId: number): Observable<any> {
    return this.http.patch(`${this.usuariosUrl}/${usuarioId}/`, {
      role_id: 2 // ID del rol "docente"
    });
  }

  // Actualizar docente existente
  actualizarDocente(id: number, docente: Partial<DocenteCarga>): Observable<DocenteCarga> {
    return this.http.put<DocenteCarga>(`${this.apiUrl}/${id}`, docente);
  }

  // Obtener estadísticas
  getEstadisticas(): Observable<EstadisticasCarga> {
    return this.http.get<EstadisticasCarga>(`${this.apiUrl}/estadisticas`);
  }

  // Asignar materia a docente
  asignarMateria(docenteId: number, materiaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${docenteId}/materias/`, { materia_id: materiaId });
  }
}