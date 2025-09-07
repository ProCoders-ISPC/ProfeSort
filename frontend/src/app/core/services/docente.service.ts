import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Docente {
  id: number;
  nombreCompleto: string;
  dni: string;
  domicilio: string;
  email: string;
  legajo: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  private apiUrl = `${environment.apiUrl}/docentes`;

  constructor(private http: HttpClient) { }

  // Obtener datos del docente por ID
  getDocenteById(id: number): Observable<Docente> {
    return this.http.get<Docente>(`${this.apiUrl}/${id}`);
  }

  // Actualizar datos del docente
  updateDocente(id: number, docente: Partial<Docente>): Observable<Docente> {
    return this.http.put<Docente>(`${this.apiUrl}/${id}`, docente);
  }
}
