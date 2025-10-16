import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface DistribucionArea {
  area: string;
  cantidad: number;
  porcentaje: number;
}

export interface CargaAcademica {
  docenteId: number;
  nombreDocente: string;
  cantidadMaterias: number;
  materias: string[];
  area: string;
}

export interface EstadisticasCarga {
  promedio: number;
  mediana: number;
  maximo: number;
  minimo: number;
  desviacionEstandar: number;
}


export interface DistribucionMaterias {
  area: string;
  totalMaterias: number;
  materiasAsignadas: number;
  materiasSinAsignar: number;
  porcentajeAsignadas: number;
  porcentajeSinAsignar: number;
}

export interface EstadisticasMaterias {
  totalMaterias: number;
  totalAsignadas: number;
  totalSinAsignar: number;
  porcentajeAsignacion: number;
  areasMayorAsignacion: string[];
  areasMenorAsignacion: string[];
}

@Injectable({
  providedIn: 'root'
})
export class InformesService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  
  getDistribucionPorArea(): Observable<DistribucionArea[]> {
    return this.http.get<DistribucionArea[]>(`${this.apiUrl}/informes/distribucion-areas`);
  }

  
  getCargaAcademica(): Observable<CargaAcademica[]> {
    return this.http.get<CargaAcademica[]>(`${this.apiUrl}/informes/carga-academica`);
  }

  
  getEstadisticasCarga(): Observable<EstadisticasCarga> {
    return this.http.get<EstadisticasCarga>(`${this.apiUrl}/informes/estadisticas-carga`);
  }

  getDistribucionMaterias(): Observable<DistribucionMaterias[]> {
    return this.http.get<DistribucionMaterias[]>(`${this.apiUrl}/informes/distribucion-materias`);
  }

 
  getEstadisticasMaterias(): Observable<EstadisticasMaterias> {
    return this.http.get<EstadisticasMaterias>(`${this.apiUrl}/informes/estadisticas-materias`);
  }
}
