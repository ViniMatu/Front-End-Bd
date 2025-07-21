import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar-component/navbar-component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'front-bd';
}
