import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: 
  `
  <app-home></app-home>
  
  <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tinaismail.github.io';
}
