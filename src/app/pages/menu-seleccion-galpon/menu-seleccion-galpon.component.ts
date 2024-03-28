import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-seleccion-galpon',
  templateUrl: './menu-seleccion-galpon.component.html',
  styleUrls: ['./menu-seleccion-galpon.component.scss']
})
export class MenuSeleccionGalponComponent {
  granjas: string[] = [];
  granja: string = '';

  constructor(private router: Router) { }

  option(indexSelection: string) {
    this.router.navigate(['/' + indexSelection])
  }
}
