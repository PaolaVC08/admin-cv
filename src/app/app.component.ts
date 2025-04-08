import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'admin-cv';
    activeLink = '';

  setActiveLink(link: string) {
    this.activeLink = link;
  }
}
