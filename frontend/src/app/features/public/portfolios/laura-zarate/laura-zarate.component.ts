import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-laura-zarate',
  standalone: true,
  imports: [],
  templateUrl: './laura-zarate.component.html',
  styleUrls: [
    './css/styles.css',
    './laura-zarate.component.css'
  ],
  encapsulation: ViewEncapsulation.None
})

export class LauraZarateComponent implements OnInit {
  isMenuActive = false;

  ngOnInit() {
    // Componente inicializado
  }

  toggleMenu() {
    this.isMenuActive = !this.isMenuActive;
  }

  closeMenu() {
    this.isMenuActive = false;
  }

  scrollTo(section: string) {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }
}

