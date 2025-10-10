import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Asignacion {
  id: number;
  id_rol: number;
  id_materia: number;
  id_usuario: number;
  fecha_asignacion: string;
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface MateriaConDocente {
  id: number;
  idmateria?: number; // Mantener compatibilidad
  nombre: string;
  codigo: string;
  horas_semanales: number;
  area: string;
  nivel: string;
  // Datos del docente asignado (obtenidos via JOIN de asignaciones)
  docenteId?: number | null;
  docenteNombre?: string | null;
  docenteLegajo?: string | null;
  docenteDni?: string | null;
  docenteEmail?: string | null;
}

export interface DocenteConMaterias {
  id_usuario: number;
  name: string;
  email: string;
  legajo: string;
  dni: string;
  area: string;
  // Materias asignadas
  materias: {
    id: number;
    idmateria?: number;
    nombre: string;
    codigo: string;
    fecha_asignacion: string;
    estado: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class AsignacionesService {
  private apiUrl = `${environment.apiUrl}/asignaciones_docentes_materias`;
  private materiasUrl = `${environment.apiUrl}/materias`;
  private usuariosUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las asignaciones
   */
  getAsignaciones(): Observable<Asignacion[]> {
    return this.http.get<any>(`${this.apiUrl}/`).pipe(
      map(response => response.data || [])
    );
  }

  /**
   * Obtener asignaciones de un docente específico
   */
  getAsignacionesByDocente(idUsuario: number): Observable<Asignacion[]> {
    return this.http.get<any>(`${this.apiUrl}/?id_usuario=${idUsuario}`).pipe(
      map(response => response.data || [])
    );
  }

  /**
   * Obtener asignaciones de una materia específica
   */
  getAsignacionesByMateria(idMateria: number): Observable<Asignacion[]> {
    return this.http.get<any>(`${this.apiUrl}/?id_materia=${idMateria}`).pipe(
      map(response => response.data || [])
    );
  }

  /**
   * Crear una nueva asignación
   */
  crearAsignacion(asignacion: Omit<Asignacion, 'id'>): Observable<Asignacion> {
    return this.http.post<Asignacion>(`${this.apiUrl}/`, {
      ...asignacion,
      fecha_asignacion: new Date().toISOString(),
      estado: 'ACTIVO'
    });
  }

  /**
   * Actualizar una asignación existente
   */
  actualizarAsignacion(id: number, asignacion: Partial<Asignacion>): Observable<Asignacion> {
    return this.http.patch<Asignacion>(`${this.apiUrl}/${id}/`, asignacion);
  }

  /**
   * Eliminar una asignación
   */
  eliminarAsignacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  /**
   * Asignar docente a materia (crea la asignación en la tabla de relación)
   */
  asignarDocenteAMateria(idMateria: number, idUsuario: number, idRol: number = 2): Observable<Asignacion> {
    return this.crearAsignacion({
      id_rol: idRol,
      id_materia: idMateria,
      id_usuario: idUsuario,
      fecha_asignacion: new Date().toISOString(),
      estado: 'ACTIVO'
    });
  }

  /**
   * Desasignar docente de materia (elimina o desactiva la asignación)
   */
  desasignarDocenteDeMateria(idMateria: number, idUsuario: number): Observable<void> {
    // Primero buscamos la asignación
    return this.http.get<Asignacion[]>(
      `${this.apiUrl}?id_materia=${idMateria}&id_usuario=${idUsuario}`
    ).pipe(
      map(asignaciones => {
        if (asignaciones && asignaciones.length > 0) {
          const asignacion = asignaciones[0];
          // Eliminamos la asignación
          this.eliminarAsignacion(asignacion.id).subscribe();
        }
      })
    );
  }

  /**
   * Obtener todas las materias con sus docentes asignados (JOIN manual)
   */
  getMateriasConDocentes(): Observable<MateriaConDocente[]> {
    return forkJoin({
      materias: this.http.get<any>(`${this.materiasUrl}/`),
      asignaciones: this.http.get<any>(`${this.apiUrl}/`),
      usuarios: this.http.get<any>(`${this.usuariosUrl}/?id_rol=2`)
    }).pipe(
      map(({ materias, asignaciones, usuarios }) => {
        const materiasData = materias.data || [];
        const asignacionesData = asignaciones.data || [];
        const usuariosData = usuarios.data || [];
        
        return materiasData.map((materia: any) => {
          // Buscar asignación activa para esta materia
          const asignacion = asignacionesData.find(
            (a: any) => a.id_materia === materia.id && a.estado === 'ACTIVO'
          );

          if (asignacion) {
            // Buscar el docente asignado
            const docente = usuariosData.find((u: any) => u.id === asignacion.id_usuario);
            
            if (docente) {
              return {
                ...materia,
                idmateria: materia.id, // Mapear id a idmateria para compatibilidad
                docenteId: docente.id,
                docenteNombre: docente.name,
                docenteLegajo: docente.legajo,
                docenteDni: docente.dni,
                docenteEmail: docente.email
              };
            }
          }

          // Materia sin docente asignado
          return {
            ...materia,
            idmateria: materia.id, // Mapear id a idmateria para compatibilidad
            docenteId: null,
            docenteNombre: null,
            docenteLegajo: null,
            docenteDni: null,
            docenteEmail: null
          };
        });
      })
    );
  }

  /**
   * Obtener materias de un docente específico (JOIN manual)
   */
  getMateriasDeDocente(idUsuario: number): Observable<any[]> {
    return forkJoin({
      asignaciones: this.getAsignacionesByDocente(idUsuario),
      materias: this.http.get<any>(`${this.materiasUrl}/`)
    }).pipe(
      map(({ asignaciones, materias }) => {
        const materiasData = materias.data || [];
        const materiasAsignadas = asignaciones
          .filter((a: any) => a.estado === 'ACTIVO')
          .map((asignacion: any) => {
            const materia = materiasData.find((m: any) => m.id === asignacion.id_materia);
            return materia ? {
              ...materia,
              idmateria: materia.id, // Mapear id a idmateria para compatibilidad
              fecha_asignacion: asignacion.fecha_asignacion,
              id_asignacion: asignacion.id
            } : null;
          })
          .filter((m: any) => m !== null);

        return materiasAsignadas;
      })
    );
  }

  /**
   * Obtener docentes con sus materias asignadas (JOIN manual)
   */
  getDocentesConMaterias(): Observable<DocenteConMaterias[]> {
    return forkJoin({
      usuarios: this.http.get<any>(`${this.usuariosUrl}/?id_rol=2`),
      asignaciones: this.http.get<any>(`${this.apiUrl}/`),
      materias: this.http.get<any>(`${this.materiasUrl}/`)
    }).pipe(
      map(({ usuarios, asignaciones, materias }) => {
        const usuariosData = usuarios.data || [];
        const asignacionesData = asignaciones.data || [];
        const materiasData = materias.data || [];
        
        return usuariosData.map((usuario: any) => {
          // Buscar asignaciones activas de este docente
          const asignacionesDocente = asignacionesData.filter(
            (a: any) => a.id_usuario === usuario.id && a.estado === 'ACTIVO'
          );

          // Obtener las materias asignadas
          const materiasAsignadas = asignacionesDocente.map((asignacion: any) => {
            const materia = materiasData.find((m: any) => m.id === asignacion.id_materia);
            return materia ? {
              id: materia.id,
              idmateria: materia.id, // Mapear id a idmateria para compatibilidad
              nombre: materia.nombre,
              codigo: materia.codigo,
              fecha_asignacion: asignacion.fecha_asignacion,
              estado: asignacion.estado
            } : null;
          }).filter((m: any) => m !== null) as any[];

          return {
            id_usuario: usuario.id,
            name: usuario.name,
            email: usuario.email,
            legajo: usuario.legajo,
            dni: usuario.dni,
            area: usuario.area,
            materias: materiasAsignadas
          };
        });
      })
    );
  }
}
