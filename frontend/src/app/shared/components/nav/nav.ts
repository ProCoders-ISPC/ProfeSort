import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css']
  
})
export class NavComponent {
  aboutLinkText = 'Quiénes Somos';
  aboutLinkRoute = '/about';

  constructor(private router: Router) {
    this.updateLink();
    this.router.events.subscribe(() => {
      this.updateLink();
    });
  }

  private updateLink() {
    if (this.router.url === '/about') {
      this.aboutLinkText = 'Inicio';
      this.aboutLinkRoute = '/';
    } else {
      this.aboutLinkText = 'Quiénes Somos';
      this.aboutLinkRoute = '/about';
    }
  }
}

