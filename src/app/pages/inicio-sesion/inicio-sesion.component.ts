import { Component } from '@angular/core';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss']
})
export class InicioSesionComponent {
    
    constructor(private userAuthService: UserAuthService) { }
  
    login( email: string
      ,password: string) {
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!emailRegex.test(email)) {
          alert('El formato del correo electrónico es incorrecto. Por favor, intenta de nuevo');
          return;
        }
      this.userAuthService.login(email, password);
    }
  
  }
