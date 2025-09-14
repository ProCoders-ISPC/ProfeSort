import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InformesService {
  private apiUrl = 'http://localhost:3001'; // mock-api

  constructor(private http: HttpClient) {}

  getInscripciones(periodo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/inscripciones?periodo=${periodo}`);
  }

  getAvanceAcademico(periodo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/avanceAcademico?periodo=${periodo}`);
  }

  getMateriasDemandadas(periodo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/materiasDemandadas?periodo=${periodo}`);
  }

  getCargaDocente(periodo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/cargaDocente?periodo=${periodo}`);
  }
}
