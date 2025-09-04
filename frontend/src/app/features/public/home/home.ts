import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { ContactComponent } from '../contact/contact';

register();

@Component({
  selector: 'app-home',
  imports: [ContactComponent],
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
