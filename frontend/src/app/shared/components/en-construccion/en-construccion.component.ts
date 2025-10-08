import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-en-construccion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="en-construccion-container">
      <div class="en-construccion-content">
        <img 
          src="/img/under-construction/bajo-construccion.gif" 
          alt="En construcción" 
          class="construccion-gif"
        />
        <h2 class="construccion-titulo">🚧 Funcionalidad en Desarrollo 🚧</h2>
        <p class="construccion-descripcion">
          {{ mensaje || 'Esta funcionalidad se encuentra en proceso de desarrollo y estará disponible próximamente.' }}
        </p>
        <p class="construccion-detalles">
          Nuestro equipo está trabajando para brindarte la mejor experiencia.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .en-construccion-container {
      background-color: #ffffff;
      border-radius: 12px;
      padding: 3rem 2rem;
      margin: 2rem auto;
      max-width: 800px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .en-construccion-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .construccion-gif {
      width: 200px;
      height: auto;
      border-radius: 8px;
    }

    .construccion-titulo {
      font-size: 1.8rem;
      font-weight: 700;
      color: #2c3e50;
      margin: 0;
    }

    .construccion-descripcion {
      font-size: 1.1rem;
      color: #555;
      line-height: 1.6;
      margin: 0;
      max-width: 600px;
    }

    .construccion-detalles {
      font-size: 0.95rem;
      color: #777;
      font-style: italic;
      margin: 0;
    }

    @media (max-width: 768px) {
      .en-construccion-container {
        padding: 2rem 1rem;
        margin: 1rem;
      }

      .construccion-gif {
        width: 150px;
      }

      .construccion-titulo {
        font-size: 1.5rem;
      }

      .construccion-descripcion {
        font-size: 1rem;
      }
    }
  `]
})
export class EnConstruccionComponent {
  @Input() mensaje?: string;
}
