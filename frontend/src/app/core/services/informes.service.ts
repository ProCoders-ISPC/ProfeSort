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

@Injectable({
  providedIn: 'root'
})
export class InformesService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // Análisis de distribución por área
  getDistribucionPorArea(): Observable<DistribucionArea[]> {
    return this.http.get<DistribucionArea[]>(`${this.apiUrl}/informes/distribucion-areas/`);
  }

  // Análisis de carga académica
  getCargaAcademica(): Observable<CargaAcademica[]> {
    return this.http.get<CargaAcademica[]>(`${this.apiUrl}/informes/carga-academica/`);
  }

  // Estadísticas descriptivas de carga
  getEstadisticasCarga(): Observable<EstadisticasCarga> {
    return this.http.get<EstadisticasCarga>(`${this.apiUrl}/informes/estadisticas-carga/`);
  }
}
