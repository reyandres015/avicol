import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GalponDataService } from 'src/app/services/galpon-data.service';

@Component({
  selector: 'app-general-granjas',
  templateUrl: './general-granjas.component.html',
  styleUrls: ['./general-granjas.component.scss']
})
export class GeneralGranjasComponent {
  galpones: string[] = [];
  galpon: string = '';

  nombreGranja: string = "no data";

  constructor(private router: Router, private galponService: GalponDataService) { }

  ngOnInit() {
    this.galpones = this.galponService.getNombresGalponUser();
  }

  option(indexSelection: number) {
    this.galponService.actualizarGalponSeleccionado(indexSelection);
    this.router.navigate(['/vista-general-granja'])
  }

}
