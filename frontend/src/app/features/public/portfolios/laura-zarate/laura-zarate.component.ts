import { Component } from '@angular/core';

@Component({
  selector: 'app-laura-zarate',
  standalone: true,
  imports: [],
  templateUrl: './laura-zarate.component.html',
  styleUrls: ['./laura-zarate.component.css']
})

export class LauraZarateComponent {
  isMenuActive = false;

  toggleMenu() {
    this.isMenuActive = !this.isMenuActive;
  }

  closeMenu() {
    this.isMenuActive = false;
  }
}

