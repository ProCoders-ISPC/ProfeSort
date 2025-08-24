import { Component } from '@angular/core';
import { BackToHomeButtonComponent } from '../../../shared/components/buttons/back-to-home-button/back-to-home-button';
import { BackgroundComponent } from '../../../shared/components/background/background';
@Component({
  selector: 'app-register',
  imports: [BackToHomeButtonComponent, BackgroundComponent,],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {}
