import { Injectable } from '@angular/core';
import { Docente } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DocentesService {
  private docentes: Docente[] = [
    { id: 1, name: 'Karina Quinteros', email: 'karina@gmail.com', legajo: 'DOC001', estado: 'Activo' },
    { id: 2, name: 'Juan Pablo Sánchez', email: 'juan@gmail.com', legajo: 'DOC002', estado: 'Activo' },
  ];

  getAll(): Docente[] {
    return this.docentes;
  }

  add(docente: Docente) {
    this.docentes.push({ ...docente, id: Date.now() });
  }

  update(id: number, docente: Partial<Docente>) {
    const index = this.docentes.findIndex(d => d.id === id);
    if (index !== -1) {
      this.docentes[index] = { ...this.docentes[index], ...docente };
    }
  }

  delete(id: number) {
    this.docentes = this.docentes.filter(d => d.id !== id);
  }
}
