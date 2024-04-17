import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GalponDataService } from 'src/app/services/galpon-data.service';
import { GranjaDataService } from 'src/app/services/granja-data.service';
import Granja from 'src/app/interfaces/granja.interface';
import { Auth, AuthSettings } from '@angular/fire/auth';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-general-granjas',
  templateUrl: './general-granjas.component.html',
  styleUrls: ['./general-granjas.component.scss']
})
export class GeneralGranjasComponent {
  granja: Granja = { name: '', path: '' };

  constructor(
    private router: Router,
    private authService: UserAuthService,
    private galponService: GalponDataService,
    private granjaService: GranjaDataService
  ) { }

  async ngOnInit() {
    await this.authService.verifyUser().then((isLogged) => {
      if (!isLogged) {
        this.router.navigate(['/']);
      }
    })
    const granja = this.granjaService.getGranjaSeleccionada();
    if (granja.galpones) {
      this.granja = granja;
    }
  }

  option(indexSelection: number) {
    this.galponService.actualizarGalponSeleccionado(indexSelection);
    this.router.navigate(['/menu-seleccion-galpon']);
  }

  arrowBack() {
    window.history.back();
  }
}
