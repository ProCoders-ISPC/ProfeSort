import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grafico-barras',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grafico-container">
      <h4 class="grafico-titulo">{{ datos?.titulo || 'Gráfico de Barras' }}</h4>
      <div class="barras-container">
        @for (item of datosGrafico; track $index) {
          <div class="barra-item">
            <div class="barra-wrapper">
              <div class="barra" [style.height.%]="item.porcentaje" [style.background-color]="item.color">
                <span class="valor">{{ item.valor }}</span>
              </div>
            </div>
            <div class="etiqueta">{{ item.etiqueta }}</div>
          </div>
        } @empty {
          <div class="sin-datos">No hay datos para mostrar</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .grafico-container {
      width: 100%;
      padding: 20px;
    }
    
    .grafico-titulo {
      text-align: center;
      margin-bottom: 20px;
      color: #2c3e50;
    }
    
    .barras-container {
      display: flex;
      align-items: end;
      justify-content: space-around;
      height: 300px;
      border-bottom: 2px solid #34495e;
      border-left: 2px solid #34495e;
      padding: 20px;
      gap: 10px;
    }
    
    .barra-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 60px;
    }
    
    .barra-wrapper {
      height: 250px;
      display: flex;
      align-items: end;
      width: 100%;
    }
    
    .barra {
      width: 100%;
      min-height: 10px;
      transition: all 0.3s ease;
      border-radius: 4px 4px 0 0;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 8px;
      position: relative;
    }
    
    .barra:hover {
      opacity: 0.8;
      transform: scale(1.05);
    }
    
    .valor {
      color: white;
      font-weight: bold;
      font-size: 12px;
      text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
    }
    
    .etiqueta {
      margin-top: 10px;
      text-align: center;
      font-size: 11px;
      color: #34495e;
      word-wrap: break-word;
      max-width: 80px;
      line-height: 1.2;
    }
    
    .sin-datos {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #7f8c8d;
      font-style: italic;
    }
  `]
})
export class GraficoBarrasComponent implements OnChanges {
  @Input() datos: any = null;
  
  datosGrafico: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos'] && this.datos) {
      this.procesarDatos();
    }
  }

  private procesarDatos(): void {
    if (!this.datos?.etiquetas || !this.datos?.datos) {
      this.datosGrafico = [];
      return;
    }

    const maxValor = Math.max(...this.datos.datos);
    const colores = this.datos.colores || ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];

    this.datosGrafico = this.datos.etiquetas.map((etiqueta: string, index: number) => ({
      etiqueta: etiqueta,
      valor: this.datos.datos[index],
      porcentaje: (this.datos.datos[index] / maxValor) * 100,
      color: colores[index % colores.length]
    }));
  }
}
