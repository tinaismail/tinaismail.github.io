import { Component, OnInit } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  faCoffee = faCoffee;
  faGithub = faGithub;
  faLinkedin = faLinkedin;
  faTwitter = faTwitter;

  constructor() { }

  ngOnInit(): void {
  }

}
