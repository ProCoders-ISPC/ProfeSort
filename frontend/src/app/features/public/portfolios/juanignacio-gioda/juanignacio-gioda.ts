import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'juanignacio-gioda',
  imports: [],
  templateUrl: './juanignacio-gioda.html',
  styleUrls: ['./juanignacio-gioda.css'],
  encapsulation: ViewEncapsulation.None
})
export class JuanignacioGioda {

  scrollToProjects() {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

}
