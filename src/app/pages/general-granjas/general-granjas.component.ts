import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GalponDataService } from 'src/app/services/galpon-data.service';
import { GranjaDataService } from 'src/app/services/granja-data.service';
import Granja from 'src/app/interfaces/granja.interface';

@Component({
  selector: 'app-general-granjas',
  templateUrl: './general-granjas.component.html',
  styleUrls: ['./general-granjas.component.scss']
})
export class GeneralGranjasComponent {
  granja: Granja = { name: '', path: '' };

  constructor(
    private router: Router,
    private galponService: GalponDataService,
    private granjaService: GranjaDataService
  ) { }

  ngOnInit() {
    const granja = this.granjaService.getGranjaSeleccionada();
    if (granja.galpones) {
      this.granja = granja;
    } else {
      alert('No hay galpones registrado en esta granja');
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
