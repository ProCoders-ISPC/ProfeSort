import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Home implements OnInit, OnDestroy {
  
  ngOnInit() {
    // El swiper-element se auto-inicializa con los atributos del HTML
  }

  ngOnDestroy() {
    // Cleanup si es necesario
  }
}
