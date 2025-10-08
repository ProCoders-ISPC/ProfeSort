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
    return this.http.get<Asignacion[]>(this.apiUrl);
  }

  /**
   * Obtener asignaciones de un docente específico
   */
  getAsignacionesByDocente(idUsuario: number): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(`${this.apiUrl}?id_usuario=${idUsuario}`);
  }

  /**
   * Obtener asignaciones de una materia específica
   */
  getAsignacionesByMateria(idMateria: number): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(`${this.apiUrl}?id_materia=${idMateria}`);
  }

  /**
   * Crear una nueva asignación
   */
  crearAsignacion(asignacion: Omit<Asignacion, 'id'>): Observable<Asignacion> {
    return this.http.post<Asignacion>(this.apiUrl, {
      ...asignacion,
      fecha_asignacion: new Date().toISOString(),
      estado: 'ACTIVO'
    });
  }

  /**
   * Actualizar una asignación existente
   */
  actualizarAsignacion(id: number, asignacion: Partial<Asignacion>): Observable<Asignacion> {
    // Con la nueva estructura usando 'id' como primary key, json-server funciona directamente
    return this.http.patch<Asignacion>(`${this.apiUrl}/${id}`, asignacion);
  }

  /**
   * Eliminar una asignación
   */
  eliminarAsignacion(id: number): Observable<void> {
    // Con la nueva estructura usando 'id' como primary key, json-server funciona directamente
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
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
      materias: this.http.get<any[]>(this.materiasUrl),
      asignaciones: this.http.get<Asignacion[]>(this.apiUrl),
      usuarios: this.http.get<any[]>(`${this.usuariosUrl}?role_id=2`)
    }).pipe(
      map(({ materias, asignaciones, usuarios }) => {
        return materias.map(materia => {
          // Buscar asignación activa para esta materia
          const asignacion = asignaciones.find(
            a => a.id_materia === materia.id && a.estado === 'ACTIVO'
          );

          if (asignacion) {
            // Buscar el docente asignado
            const docente = usuarios.find(u => u.id === asignacion.id_usuario);
            
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
      materias: this.http.get<any[]>(this.materiasUrl)
    }).pipe(
      map(({ asignaciones, materias }) => {
        const materiasAsignadas = asignaciones
          .filter(a => a.estado === 'ACTIVO')
          .map(asignacion => {
            const materia = materias.find(m => m.id === asignacion.id_materia);
            return materia ? {
              ...materia,
              idmateria: materia.id, // Mapear id a idmateria para compatibilidad
              fecha_asignacion: asignacion.fecha_asignacion,
              id_asignacion: asignacion.id
            } : null;
          })
          .filter(m => m !== null);

        return materiasAsignadas;
      })
    );
  }

  /**
   * Obtener docentes con sus materias asignadas (JOIN manual)
   */
  getDocentesConMaterias(): Observable<DocenteConMaterias[]> {
    return forkJoin({
      usuarios: this.http.get<any[]>(`${this.usuariosUrl}?role_id=2`),
      asignaciones: this.http.get<Asignacion[]>(this.apiUrl),
      materias: this.http.get<any[]>(this.materiasUrl)
    }).pipe(
      map(({ usuarios, asignaciones, materias }) => {
        return usuarios.map(usuario => {
          // Buscar asignaciones activas de este docente
          const asignacionesDocente = asignaciones.filter(
            a => a.id_usuario === usuario.id && a.estado === 'ACTIVO'
          );

          // Obtener las materias asignadas
          const materiasAsignadas = asignacionesDocente.map(asignacion => {
            const materia = materias.find(m => m.id === asignacion.id_materia);
            return materia ? {
              id: materia.id,
              idmateria: materia.id, // Mapear id a idmateria para compatibilidad
              nombre: materia.nombre,
              codigo: materia.codigo,
              fecha_asignacion: asignacion.fecha_asignacion,
              estado: asignacion.estado
            } : null;
          }).filter(m => m !== null) as any[];

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
