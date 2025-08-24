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
    
    window.scrollTo(0, 0);
  }

  ngAfterViewInit() {
   
    console.log('ngAfterViewInit called');
    setTimeout(() => {
      this.createParticles();
      this.setupSmoothScrolling();
    }, 200);
  }

  ngOnDestroy() {
   
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
      particlesContainer.innerHTML = '';
    }
  }

  private createParticles() {
    console.log('createParticles called');
    
    
    const debugParticles = document.querySelectorAll('.debug-particle');
    debugParticles.forEach(p => p.remove());
    
    
    const particlesContainer = this.particlesContainer?.nativeElement;
    console.log('Particles container found via ViewChild:', particlesContainer);
    
    if (!particlesContainer) {
      console.error('Particles container not found!');
      return;
    }

    
    particlesContainer.innerHTML = '';

    const particleCount = 50; 
    console.log('Creating', particleCount, 'original-style particles');

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      
      
      particle.style.position = 'absolute';
      particle.style.width = '4px';  
      particle.style.height = '4px';
      particle.style.background = 'rgba(255, 255, 255, 0.3)'; 
      particle.style.borderRadius = '50%';
      particle.style.zIndex = '1';
      particle.style.pointerEvents = 'none';
      
      
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
