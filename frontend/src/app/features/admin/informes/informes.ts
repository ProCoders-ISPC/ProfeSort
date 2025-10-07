import { Component, OnInit, TrackByFunction } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InformesService, DistribucionArea, CargaAcademica, EstadisticasCarga, DistribucionMaterias, EstadisticasMaterias } from '../../../core/services/informes.service';
import { GraficoBarrasComponent } from './grafico-barras';

@Component({
  selector: 'app-informes',
  standalone: true,
  templateUrl: './informes.html',
  styleUrls: ['./informes.css'],
  imports: [CommonModule, FormsModule, GraficoBarrasComponent]
})
export class InformesComponent implements OnInit {
  tipoInforme = 'distribucion-areas';
  informeGenerado = false;
  cargandoDatos = false;
  error = '';

  
  distribucionAreas: DistribucionArea[] = [];
  cargaAcademica: CargaAcademica[] = [];
  estadisticasCarga: EstadisticasCarga | null = null;

  
  distribucionMaterias: DistribucionMaterias[] = [];
  estadisticasMaterias: EstadisticasMaterias | null = null;


  datosGraficoAreas: any = null;
  datosGraficoCarga: any = null;
  datosGraficoMaterias: any = null;
  datosGraficoAsignacion: any = null;

  trackItem: TrackByFunction<DistribucionArea> | undefined;

  constructor(private informesService: InformesService) {}

  ngOnInit(): void {
    this.generarInforme();
  }

  generarInforme(): void {
    this.cargandoDatos = true;
    this.error = '';
    this.informeGenerado = false;

    if (this.tipoInforme === 'distribucion-areas') {
      this.generarInformeDistribucion();
    } else if (this.tipoInforme === 'carga-academica') {
      this.generarInformeCarga();
    } else if (this.tipoInforme === 'distribucion-materias') {
      this.generarInformeMaterias();
    }
  }

  private generarInformeDistribucion(): void {
    this.informesService.getDistribucionPorArea().subscribe({
      next: (data) => {
        this.distribucionAreas = data;
        this.procesarDatosDistribucion();
        this.informeGenerado = true;
        this.cargandoDatos = false;
      },
      error: (err) => {
        console.error('Error al generar informe de distribución:', err);
        this.error = 'Error al cargar datos de distribución por área';
        this.cargandoDatos = false;
      }
    });
  }

  private generarInformeCarga(): void {
    Promise.all([
      this.informesService.getCargaAcademica().toPromise(),
      this.informesService.getEstadisticasCarga().toPromise()
    ]).then(([carga, estadisticas]) => {
      this.cargaAcademica = carga || [];
      this.estadisticasCarga = estadisticas || null;
      this.procesarDatosCarga();
      this.informeGenerado = true;
      this.cargandoDatos = false;
    }).catch((err) => {
      console.error('Error al generar informe de carga:', err);
      this.error = 'Error al cargar datos de carga académica';
      this.cargandoDatos = false;
    });
  }


  private generarInformeMaterias(): void {
    Promise.all([
      this.informesService.getDistribucionMaterias().toPromise(),
      this.informesService.getEstadisticasMaterias().toPromise()
    ]).then(([distribucion, estadisticas]) => {
      this.distribucionMaterias = distribucion || [];
      this.estadisticasMaterias = estadisticas || null;
      this.procesarDatosMaterias();
      this.informeGenerado = true;
      this.cargandoDatos = false;
    }).catch((err) => {
      console.error('Error al generar informe de materias:', err);
      this.error = 'Error al cargar datos de distribución de materias';
      this.cargandoDatos = false;
    });
  }

  private procesarDatosDistribucion(): void {
    this.datosGraficoAreas = {
      tipo: 'barras',
      titulo: 'Distribución de Docentes por Área',
      etiquetas: this.distribucionAreas.map(item => item.area),
      datos: this.distribucionAreas.map(item => item.cantidad),
      colores: ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#00BCD4']
    };
  }

  private procesarDatosCarga(): void {
    const datosOrdenados = this.cargaAcademica
      .sort((a, b) => b.cantidadMaterias - a.cantidadMaterias)
      .slice(0, 15); 

    this.datosGraficoCarga = {
      tipo: 'barras',
      titulo: 'Carga Académica por Docente (Top 15)',
      etiquetas: datosOrdenados.map(item => item.nombreDocente),
      datos: datosOrdenados.map(item => item.cantidadMaterias),
      colores: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    };
  }

 
  private procesarDatosMaterias(): void {
  
    this.datosGraficoMaterias = {
      tipo: 'barras',
      titulo: 'Total de Materias por Área de Conocimiento',
      etiquetas: this.distribucionMaterias.map(item => item.area),
      datos: this.distribucionMaterias.map(item => item.totalMaterias),
      colores: ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#00BCD4', '#795548', '#607D8B']
    };

   
    this.datosGraficoAsignacion = {
      tipo: 'barras-comparativas',
      titulo: 'Materias Asignadas vs Sin Asignar por Área',
      categorias: this.distribucionMaterias.map(item => item.area),
      series: [
        {
          nombre: 'Asignadas',
          datos: this.distribucionMaterias.map(item => item.materiasAsignadas),
          color: '#4CAF50'
        },
        {
          nombre: 'Sin Asignar',
          datos: this.distribucionMaterias.map(item => item.materiasSinAsignar),
          color: '#F44336'
        }
      ]
    };
  }

  getPromedioFormateado(): string {
    return this.estadisticasCarga?.promedio.toFixed(2) || '0';
  }

  getDesviacionFormateada(): string {
    return this.estadisticasCarga?.desviacionEstandar.toFixed(2) || '0';
  }

  getPorcentajeAsignacionFormateado(): string {
    return this.estadisticasMaterias?.porcentajeAsignacion.toFixed(1) || '0';
  }

  getInterpretacionDistribucion(): string {
    if (this.distribucionAreas.length === 0) return '';
    
    const areaMayorDistribucion = this.distribucionAreas
      .reduce((prev, current) => prev.cantidad > current.cantidad ? prev : current);
    
    return `El área con mayor concentración de docentes es ${areaMayorDistribucion.area} con ${areaMayorDistribucion.cantidad} docentes (${areaMayorDistribucion.porcentaje}% del total).`;
  }

  getInterpretacionCarga(): string {
    if (!this.estadisticasCarga) return '';
    
    let interpretacion = `El promedio de materias por docente es ${this.getPromedioFormateado()}. `;
    
    if (this.estadisticasCarga.desviacionEstandar > 1.5) {
      interpretacion += 'La alta desviación estándar indica una distribución desigual de la carga académica.';
    } else {
      interpretacion += 'La distribución de carga académica es relativamente equilibrada.';
    }
    
    return interpretacion;
  }

 
  getInterpretacionMaterias(): string {
    if (!this.estadisticasMaterias || this.distribucionMaterias.length === 0) return '';
    
    const areaMayorSinAsignar = this.distribucionMaterias
      .reduce((prev, current) => prev.materiasSinAsignar > current.materiasSinAsignar ? prev : current);
    
    const areaMayorAsignacion = this.distribucionMaterias
      .reduce((prev, current) => prev.porcentajeAsignadas > current.porcentajeAsignadas ? prev : current);

    let interpretacion = `Del total de ${this.estadisticasMaterias.totalMaterias} materias, ${this.estadisticasMaterias.totalAsignadas} están asignadas (${this.getPorcentajeAsignacionFormateado()}%) y ${this.estadisticasMaterias.totalSinAsignar} sin asignar. `;
    
    interpretacion += `El área "${areaMayorSinAsignar.area}" tiene la mayor cantidad de materias sin asignar (${areaMayorSinAsignar.materiasSinAsignar}), `;
    interpretacion += `mientras que "${areaMayorAsignacion.area}" tiene el mayor porcentaje de asignación (${areaMayorAsignacion.porcentajeAsignadas.toFixed(1)}%).`;
    
    return interpretacion;
  }

  
  getMaxMaterias(): number {
    if (this.distribucionMaterias.length === 0) return 1;
    
    return Math.max(
      ...this.distribucionMaterias.map(area => 
        Math.max(area.materiasAsignadas, area.materiasSinAsignar)
      )
    );
  }
}
