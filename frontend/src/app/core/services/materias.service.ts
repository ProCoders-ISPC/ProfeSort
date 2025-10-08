
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AsignacionesService } from './asignaciones.service';
import { switchMap, map } from 'rxjs/operators';

export interface DocenteSimple {
  id: number;
  id_usuario?: number; // Mantener compatibilidad
  name: string;
  legajo: string;
  dni?: string;
  email: string;
  area?: string;
}

export interface Materia {
  id: number;
  idmateria?: number; // Mantener compatibilidad con el frontend
  nombre: string;
  codigo: string;
  horas_semanales?: number;
  area?: string;
  nivel?: string;
  // Para mostrar datos del docente asignado (via JOIN con asignaciones)
  docenteId?: number | null;
  docenteNombre?: string | null;
  docenteLegajo?: string | null;
  docenteDni?: string | null;
  docenteEmail?: string | null;
}

@Injectable({ providedIn: 'root' })
export class MateriasService {
  private apiUrl = 'http://localhost:3000/materias';
  private usersUrl = 'http://localhost:3000/usuarios';

  constructor(
    private http: HttpClient,
    private asignacionesService: AsignacionesService
  ) {}

  /**
   * Obtener todas las materias CON datos de docentes asignados
   * Usa el servicio de asignaciones para hacer el JOIN
   */
  getMaterias(): Observable<Materia[]> {
    return this.asignacionesService.getMateriasConDocentes();
  }

  /**
   * Obtener materias de un docente específico
   * Usa el servicio de asignaciones para filtrar por docente
   */
  getMateriasByDocente(docenteId: number): Observable<Materia[]> {
    return this.asignacionesService.getMateriasDeDocente(docenteId);
  }

  /**
   * Crear nueva materia (sin asignación de docente)
   */
  addMateria(materia: Omit<Materia, 'id'>): Observable<Materia> {
    return this.http.post<Materia>(this.apiUrl, materia);
  }

  /**
   * Actualizar materia
   */
  updateMateria(id: number, materia: Partial<Materia>): Observable<Materia> {
    // Con la nueva estructura usando 'id' como primary key, json-server funciona directamente
    return this.http.patch<Materia>(`${this.apiUrl}/${id}`, materia);
  }

  /**
   * Eliminar materia
   * También elimina las asignaciones relacionadas
   */
  deleteMateria(id: number): Observable<void> {
    // Eliminar asignaciones primero, luego la materia
    return this.asignacionesService.getAsignacionesByMateria(id).pipe(
      switchMap(asignaciones => {
        const deletePromises = asignaciones.map(a => 
          this.asignacionesService.eliminarAsignacion(a.id).toPromise()
        );
        return Promise.all(deletePromises);
      }),
      switchMap(() => this.http.delete<void>(`${this.apiUrl}/${id}`))
    );
  }

  /**
   * Asignar o desasignar docente a materia
   * Usa la tabla de asignaciones_docentes_materias
   */
  asignarDocente(materiaId: number, docenteId: number | null): Observable<any> {
    if (docenteId === null) {
      // Desasignar docente
      return this.asignacionesService.getAsignacionesByMateria(materiaId).pipe(
        switchMap(asignaciones => {
          if (asignaciones.length > 0) {
            // Eliminar la asignación existente
            return this.asignacionesService.eliminarAsignacion(asignaciones[0].id);
          }
          return new Observable(observer => {
            observer.next(null);
            observer.complete();
          });
        })
      );
    } else {
      // Primero verificar si ya existe una asignación
      return this.asignacionesService.getAsignacionesByMateria(materiaId).pipe(
        switchMap(asignaciones => {
          if (asignaciones.length > 0) {
            // Ya existe una asignación, actualizarla
            return this.asignacionesService.actualizarAsignacion(
              asignaciones[0].id,
              { id_usuario: docenteId, estado: 'ACTIVO' }
            );
          } else {
            // No existe asignación, crear una nueva
            return this.asignacionesService.asignarDocenteAMateria(materiaId, docenteId);
          }
        })
      );
    }
  }

  /**
   * Obtener lista de docentes disponibles
   */
  getDocentes(): Observable<DocenteSimple[]> {
    return this.http.get<DocenteSimple[]>(`${this.usersUrl}?role_id=2`).pipe(
      map(docentes => docentes.map(docente => ({
        ...docente,
        id_usuario: docente.id // Mapear id a id_usuario para compatibilidad
      })))
    );
  }
}

