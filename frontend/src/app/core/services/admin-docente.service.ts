import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocenteModel } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  private apiUrl = 'http://localhost:3000/api/docentes/carga';

  constructor(private http: HttpClient) {}

  getDocentesCarga(): Observable<DocenteModel[]> {
    return this.http.get<DocenteModel[]>(this.apiUrl);
  }
}