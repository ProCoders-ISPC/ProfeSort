import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InformesService } from '../../../core/services/informes.service';
import { GraficoBarrasComponent } from './grafico-barras';

@Component({
  selector: 'app-informes',
  standalone: true,
  templateUrl: './informes.html',
  styleUrls: ['./informes.css'],
  imports: [CommonModule, FormsModule]
})
export class InformesComponent {
  tipoInforme = 'inscripciones';
  periodo = '';
  informeGenerado = false;
  datosInforme: any = null;

  private informesService = inject(InformesService);

  generarInforme() {
    this.informeGenerado = false;
    this.datosInforme = null;
    let obs$;
    if (this.tipoInforme === 'avance') {
      // Avance académico: combinar inscripciones, asistencias y calificaciones
      Promise.all([
        this.informesService.getInscripciones().toPromise(),
        this.informesService.getAsistencias().toPromise(),
        this.informesService.getCalificaciones().toPromise()
      ]).then(([inscripciones, asistencias, calificaciones]) => {
        // Agrupar por estudiante y materia
        const avance = (inscripciones as any[]).map(insc => {
          const estudianteId = insc.estudianteId;
          const materia = insc.materia;
          const asis = (asistencias as any[]).filter(a => a.estudianteId === estudianteId && a.materia === materia);
          const calif = (calificaciones as any[]).filter(c => c.estudianteId === estudianteId && c.materia === materia);
          return {
            estudianteId,
            materia,
            estado: insc.estado,
            asistencias: asis.length,
            presentes: asis.filter(a => a.presente).length,
            ausentes: asis.filter(a => !a.presente).length,
            calificaciones: calif.map(c => ({ nota: c.nota, fecha: c.fecha }))
          };
        });
        this.datosInforme = avance;
        this.informeGenerado = true;
      }).catch(() => {
        this.datosInforme = { error: 'No se pudo obtener el informe de avance académico.' };
        this.informeGenerado = true;
      });
      return;
    }
    switch (this.tipoInforme) {
      case 'inscripciones':
        obs$ = this.informesService.getInscripciones();
        break;
      case 'docente':
        obs$ = this.informesService.getCargaDocente();
        break;
      case 'asistencias':
        obs$ = this.informesService.getAsistencias();
        break;
      case 'calificaciones':
        obs$ = this.informesService.getCalificaciones();
        break;
      case 'materias':
        obs$ = this.informesService.getMaterias();
        break;
      default:
        obs$ = null;
    }
    if (obs$) {
      obs$.subscribe({
        next: (data) => {
          this.datosInforme = data;
          this.informeGenerado = true;
        },
        error: () => {
          this.datosInforme = { error: 'No se pudo obtener el informe.' };
          this.informeGenerado = true;
        }
      });
    }
  }
}
