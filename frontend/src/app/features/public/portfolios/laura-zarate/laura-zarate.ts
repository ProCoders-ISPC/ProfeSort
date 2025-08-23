import { Component } from '@angular/core';

@Component({
  selector: 'app-laura-zarate',
  standalone: true,
  imports: [],
  templateUrl: 'laura-zarate.html',
  styleUrls: ['./laura-zarate.css']
})
export class LauraZarate {
  isMenuActive = false;

  toggleMenu() {
    this.isMenuActive = !this.isMenuActive;
  }

  closeMenu() {
    this.isMenuActive = false;
  }
}

