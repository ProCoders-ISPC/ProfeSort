
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AsignacionesService } from './asignaciones.service';
import { switchMap, map } from 'rxjs/operators';

export interface DocenteSimple {
  id: number;
  id_usuario?: number; 
  name: string;
  legajo: string;
  dni?: string;
  email: string;
  area?: string;
}

export interface Materia {
  id: number;
  idmateria?: number; 
  nombre: string;
  codigo: string;
  horas_semanales?: number;
  area?: string;
  nivel?: string;
  docenteId?: number | null;
  docenteNombre?: string | null;
  docenteLegajo?: string | null;
  docenteDni?: string | null;
  docenteEmail?: string | null;
}

@Injectable({ providedIn: 'root' })
export class MateriasService {
  private apiUrl = `${environment.apiUrl}/materias`;
  private usersUrl = `${environment.apiUrl}/usuarios`;

  constructor(
    private http: HttpClient,
    private asignacionesService: AsignacionesService
  ) {}


  getMaterias(): Observable<Materia[]> {
    return this.asignacionesService.getMateriasConDocentes();
  }


  getMateriasByDocente(docenteId: number): Observable<Materia[]> {
    return this.asignacionesService.getMateriasDeDocente(docenteId);
  }


  addMateria(materia: Omit<Materia, 'id'>): Observable<Materia> {
    return this.http.post<any>(`${this.apiUrl}/`, materia).pipe(
      map(response => response.data || response)
    );
  }


  updateMateria(id: number, materia: Partial<Materia>): Observable<Materia> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/`, materia).pipe(
      map(response => response.data || response)
    );
  }


  deleteMateria(id: number): Observable<void> {
    return this.asignacionesService.getAsignacionesByMateria(id).pipe(
      switchMap(asignaciones => {
        const deletePromises = asignaciones.map(a => 
          this.asignacionesService.eliminarAsignacion(a.id).toPromise()
        );
        return Promise.all(deletePromises);
      }),
      switchMap(() => this.http.delete<void>(`${this.apiUrl}/${id}/`))
    );
  }


  asignarDocente(materiaId: number, docenteId: number | null): Observable<any> {
    console.log('🎯 asignarDocente() llamado:', { materiaId, docenteId });
    
    return this.asignacionesService.getAsignacionesByMateria(materiaId).pipe(
      switchMap(asignaciones => {
        console.log('  📋 Asignaciones encontradas para materia', materiaId, ':', asignaciones);
        
        if (docenteId === null) {
          console.log('  ➡️ Desasignando docente...');
          if (asignaciones.length > 0) {
            console.log('  🗑️ Eliminando asignación ID:', asignaciones[0].id);
            return this.asignacionesService.eliminarAsignacion(asignaciones[0].id);
          }
          console.log('  ℹ️ No hay asignaciones para eliminar');
          return new Observable(observer => {
            observer.next(null);
            observer.complete();
          });
        } else {
          console.log('  ➡️ Asignando/actualizando docente a ID:', docenteId);
          
          if (asignaciones.length > 0) {
            console.log('  ✏️ Actualizando asignación ID:', asignaciones[0].id, 'con docente:', docenteId);
            return this.asignacionesService.actualizarAsignacion(
              asignaciones[0].id,
              { id_usuario: docenteId, id_materia: materiaId, estado: 'ACTIVO' }
            );
          } else {
            console.log('  ➕ Creando nueva asignación para materia:', materiaId, 'docente:', docenteId);
            return this.asignacionesService.asignarDocenteAMateria(materiaId, docenteId);
          }
        }
      })
    );
  }


  getDocentes(): Observable<DocenteSimple[]> {
    return this.http.get<any>(`${this.usersUrl}/?id_rol=2`).pipe(
      map(response => {
        const docentes = response.data || [];
        return docentes.map((docente: any) => ({
          ...docente,
          id_usuario: docente.id 
        }));
      })
    );
  }
}

