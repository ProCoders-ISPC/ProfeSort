import { Component, OnInit, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';

// Registrar componentes de Swiper
register();

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Home implements OnInit, AfterViewInit {

  ngOnInit() {
    // Inicialización del componente
  }

  ngAfterViewInit() {
    // Configuración de Swiper después de que la vista se haya inicializado
    this.initSwiper();
  }

  private initSwiper() {
    const swiperElement = document.querySelector('.hero-swiper') as any;
    
    if (swiperElement) {
      // Configuración de Swiper
      const swiperParams = {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: 'bullets',
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        }
      };

      // Asignar parámetros a swiper element
      Object.assign(swiperElement, swiperParams);
      
      // Inicializar swiper
      swiperElement.initialize();
    }
  }
}
