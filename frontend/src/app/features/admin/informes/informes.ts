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
  imports: [CommonModule, FormsModule, GraficoBarrasComponent]
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
    switch (this.tipoInforme) {
      case 'inscripciones':
        obs$ = this.informesService.getInscripciones(this.periodo);
        break;
      case 'avance':
        obs$ = this.informesService.getAvanceAcademico(this.periodo);
        break;
      case 'demanda':
        obs$ = this.informesService.getMateriasDemandadas(this.periodo);
        break;
      case 'docente':
        obs$ = this.informesService.getCargaDocente(this.periodo);
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
