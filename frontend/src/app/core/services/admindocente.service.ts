import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface DocenteCarga {
  id: number;
  id_usuario?: number; // Mantener compatibilidad con el frontend
  name: string; // Nombre completo como en db.json
  email: string;
  legajo: string;
  dni: string;
  fecha_nacimiento: string;
  domicilio: string;
  telefono: string;
  password?: string;
  id_rol: number;
  area?: string;
  fecha_ingreso?: string;
  is_active?: boolean;
  created_at?: string;
  estado?: 'Activo' | 'Inactivo';
  cantidadMaterias?: number;
  cantidadEstudiantes?: number;
  materias?: string[];
}

export interface EstadisticasCarga {
  totalDocentes: number;
}

@Injectable({ 
  providedIn: 'root' 
})
export class AdminDocenteService {
  private apiUrl = `${environment.apiUrl}/usuarios`; // Nuevo endpoint usuarios
  private usuariosUrl = `${environment.apiUrl}/usuarios`; 

  readonly ROL_ADMIN = 1;
  readonly ROL_DOCENTE = 2;
  readonly ROL_USUARIO = 3;
  
  constructor(private http: HttpClient) {}
  
  getDocentesCarga(
    termino?: string,
    estado?: string,
    area?: string,
    page: number = 1, 
    limit: number = 10
  ): Observable<DocenteCarga[]> {
    let params = new HttpParams();
    

    params = params.set('id_rol', '2');
    
    if (area) params = params.set('area', area);
    if (termino) params = params.set('name_like', termino);
    
    // Obtener docentes y calcular conteos usando asignaciones
    return forkJoin({
      docentes: this.http.get<any[]>(`${this.apiUrl}`, { params }),
      estudiantes: this.http.get<any[]>(`${environment.apiUrl}/estudiantes`),
      asignaciones: this.http.get<any[]>(`${environment.apiUrl}/asignaciones_docentes_materias`),
      materias: this.http.get<any[]>(`${environment.apiUrl}/materias`)
    }).pipe(
      map(({ docentes, estudiantes, asignaciones, materias }) => {
        return docentes.map(docente => {
          // Contar estudiantes asignados a este docente
          const estudiantesDelDocente = estudiantes.filter(
            est => est.docenteId === docente.id
          );
          
          // Obtener asignaciones activas de este docente
          const asignacionesDocente = asignaciones.filter(
            asig => asig.id_usuario === docente.id && asig.estado === 'ACTIVO'
          );
          
          // Obtener materias de las asignaciones
          const materiasDelDocente = asignacionesDocente.map(asig => {
            const materia = materias.find(mat => mat.id === asig.id_materia);
            return materia ? materia.nombre : null;
          }).filter(nombre => nombre !== null);
          
          return {
            ...docente,
            id_usuario: docente.id, // Mapear id a id_usuario para compatibilidad
            estado: docente.is_active ? 'Activo' : 'Inactivo',
            cantidadEstudiantes: estudiantesDelDocente.length,
            cantidadMaterias: asignacionesDocente.length,
            materias: materiasDelDocente
          } as DocenteCarga;
        });
      })
    );
  }

  getDocenteCarga(id: number): Observable<DocenteCarga> {
    return this.http.get<DocenteCarga>(`${this.apiUrl}/${id}`);
  }

  getUsuariosRegulares(page = 1, limit = 10): Observable<any[]> {
    const params = new HttpParams()
      .set('id_rol', 'docente'); 
    
    return this.http.get<any[]>(`${this.usuariosUrl}`, { params });
  }

  asignarRol(usuarioId: number, rolId: number): Observable<any> {
    return this.http.patch(`${this.usuariosUrl}/${usuarioId}`, { id_rol: rolId });
  }
  
  actualizarDocente(id: number, docente: Partial<DocenteCarga>): Observable<DocenteCarga> {
    // Con la nueva estructura usando 'id' como primary key, json-server funciona directamente
    return this.http.patch<DocenteCarga>(`${this.apiUrl}/${id}`, docente);
  }

  getEstadisticas(): Observable<EstadisticasCarga> {
    return this.http.get<EstadisticasCarga>(`${this.apiUrl}/estadisticas`);
  }
}