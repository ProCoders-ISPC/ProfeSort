import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  private apiUrl = environment.apiUrl + '/docentes';

  constructor(private http: HttpClient) {}

  // Obtener datos del docente por ID
  getDocenteById(id: number): Observable<Docente> {
    return this.http.get<Docente>(`${this.apiUrl}/${id}`);
  }

  // Actualizar datos del docente
  updateDocente(id: number, docente: Partial<Docente>): Observable<Docente> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Docente>(url, docente).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // Puedes personalizar el manejo de errores aquí
    let errorMsg = 'Ocurrió un error inesperado.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMsg = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMsg = `Error ${error.status}: ${error.message}`;
    }
    return throwError(() => new Error(errorMsg));
  }
}
