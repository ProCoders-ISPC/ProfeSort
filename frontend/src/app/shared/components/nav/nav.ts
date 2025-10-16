import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/services';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, ClickOutsideDirective],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css']
  
})
export class NavComponent {
  aboutLinkText = 'Quiénes Somos';
  aboutLinkRoute = '/about';

  constructor(private router: Router, private authService: AuthService) {
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

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  isDropdownOpen = false;

  toggleDropdown(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log('Dropdown estado:', this.isDropdownOpen); // Debug
  }

  closeDropdown() {
    this.isDropdownOpen = false;
    console.log('Cerrando dropdown'); // Debug
  }

  goToPanel() {
    const user = this.authService.getCurrentUser();
    console.log('Usuario actual:', user); // Debug
    
    if (user?.id_rol === 1) {
      console.log('Navegando a admin panel'); // Debug
      this.router.navigate(['/admin']);
    } else if (user?.id_rol === 2) {
      console.log('Navegando a docente panel'); // Debug
      this.router.navigate(['/docente']);
    } else {
      console.log('Rol no reconocido:', user?.id_rol); // Debug
    }
    this.closeDropdown();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.closeDropdown();
  }
}

