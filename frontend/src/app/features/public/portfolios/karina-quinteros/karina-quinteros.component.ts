import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-karina-quinteros',
  imports: [RouterLink],
  templateUrl: './karina-quinteros.component.html',
  styleUrl: './karina-quinteros.component.css',
  encapsulation: ViewEncapsulation.None
})
export class KarinaQuinteros implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('particles', { static: true }) particlesContainer!: ElementRef;

  ngOnInit() {
    // Scroll to top when component loads
    window.scrollTo(0, 0);
  }

  ngAfterViewInit() {
    // Create particles after view is initialized
    console.log('ngAfterViewInit called');
    setTimeout(() => {
      this.createParticles();
      this.setupSmoothScrolling();
    }, 200);
  }

  ngOnDestroy() {
    // Clean up particles when component is destroyed
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
      particlesContainer.innerHTML = '';
    }
  }

  private createParticles() {
    console.log('createParticles called');
    
    // Limpiar partículas de debug del body primero
    const debugParticles = document.querySelectorAll('.debug-particle');
    debugParticles.forEach(p => p.remove());
    
    // Usar el contenedor original pero con estilos que funcionen
    const particlesContainer = this.particlesContainer?.nativeElement;
    console.log('Particles container found via ViewChild:', particlesContainer);
    
    if (!particlesContainer) {
      console.error('Particles container not found!');
      return;
    }

    // Clear existing particles
    particlesContainer.innerHTML = '';

    const particleCount = 50; // Más cantidad de partículas
    console.log('Creating', particleCount, 'original-style particles');

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Distribución aleatoria
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      
      // Estilos discretos pero visibles como en la maqueta original
      particle.style.position = 'absolute';
      particle.style.width = '4px';  // Tamaño original
      particle.style.height = '4px';
      particle.style.background = 'rgba(255, 255, 255, 0.3)'; // Más visible pero sutil
      particle.style.borderRadius = '50%';
      particle.style.zIndex = '1';
      particle.style.pointerEvents = 'none';
      
      // Animación CSS original
      particle.style.animation = `float ${6 + Math.random() * 3}s infinite ease-in-out`;
      particle.style.animationDelay = Math.random() * 6 + 's';
      
      particlesContainer.appendChild(particle);
    }
    
    console.log('Original particles created in proper container. Count:', particlesContainer.children.length);
  }

  private setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e: Event) {
        e.preventDefault();
        const href = (e.target as HTMLAnchorElement).getAttribute('href');
        const target = document.querySelector(href || '');
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}
