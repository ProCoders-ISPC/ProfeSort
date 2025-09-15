import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InformesService {
  private apiUrl = 'http://localhost:3000'; // mock-api

  constructor(private http: HttpClient) {}

  getInscripciones(): Observable<any> {
    return this.http.get(`${this.apiUrl}/inscripciones`);
  }

  getCargaDocente(): Observable<any> {
    return this.http.get(`${this.apiUrl}/carga`);
  }

  getDocentes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/docentes`);
  }

  getEstudiantes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/estudiantes`);
  }

  getAsistencias(): Observable<any> {
    return this.http.get(`${this.apiUrl}/asistencias`);
  }

  getCalificaciones(): Observable<any> {
    return this.http.get(`${this.apiUrl}/calificaciones`);
  }

  getMaterias(): Observable<any> {
    return this.http.get(`${this.apiUrl}/materias`);
  }
}
