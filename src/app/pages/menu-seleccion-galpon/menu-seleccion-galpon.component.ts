import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GalponDataService } from 'src/app/services/galpon-data.service';

@Component({
  selector: 'app-menu-seleccion-galpon',
  templateUrl: './menu-seleccion-galpon.component.html',
  styleUrls: ['./menu-seleccion-galpon.component.scss']
})
export class MenuSeleccionGalponComponent {
  granjas: string[] = [];
  granja: string = '';

  constructor(private router: Router, 
    private galponDataService: GalponDataService,
  ) { }

  option(indexSelection: string) {
    this.router.navigate(['/' + indexSelection])
  }

  arrowBack() {
    window.history.back()
  }
}
