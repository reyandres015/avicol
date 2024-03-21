import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss']
})
export class InicioSesionComponent {
  inicioSesionExitoso: boolean = true;
  constructor(private userAuthService: UserAuthService, private router: Router) { }

  loginUser(cedula: string, fechaNacimiento: string) {
    this.router.navigate(["/menu-granjas"])
  }

  resetMessage() {
    this.inicioSesionExitoso = true;
  }
}
