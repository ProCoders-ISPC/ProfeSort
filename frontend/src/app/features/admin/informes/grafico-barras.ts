import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'grafico-barras',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="data && data.length">
      <h5>{{ title }}</h5>
      <div style="display: flex; align-items: flex-end; height: 200px; gap: 8px;">
        <div *ngFor="let item of data" style="flex:1; text-align:center;">
          <div style="background:#007bff; width:100%; border-radius:4px 4px 0 0;" [style.height.%]="item.value">
          </div>
          <small>{{ item.label }}</small>
        </div>
      </div>
    </div>
  `
})
export class GraficoBarrasComponent {
  @Input() data: { label: string, value: number }[] = [];
  @Input() title = '';
}
