import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'juanignacio-gioda',
  imports: [],
  templateUrl: './juanignacio-gioda.html',
  styleUrls: ['./juanignacio-gioda.css'],
  encapsulation: ViewEncapsulation.None
})
export class JuanignacioGioda {

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToProjects() {
    this.scrollToSection('projects');
  }

  scrollToAbout() {
    this.scrollToSection('about');
  }

  scrollToSkills() {
    this.scrollToSection('skills');
  }

  scrollToContact() {
    this.scrollToSection('contact');
  }

}
