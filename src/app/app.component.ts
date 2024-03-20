import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from './services/user-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  inicioSesionExitoso: boolean = true;
  constructor(private userAuthService: UserAuthService, private router: Router) { }

  loginUser(cedula: string, fechaNacimiento: string) {
  }

  resetMessage() {
    this.inicioSesionExitoso = true;
  }
}
