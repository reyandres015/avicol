import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-granjas',
  templateUrl: './menu-granjas.component.html',
  styleUrls: ['./menu-granjas.component.scss']
})
export class MenuGranjasComponent {
  granjas = ['El Recuerdo', 'Quinchita', 'El Gonzal'];
  granja: string = '';

  constructor(private router: Router) { }

  option(indexSelection: number) {
    this.granja = this.convertirARutaValida(this.granjas[indexSelection])
    this.router.navigate([this.granja])
  }

  convertirARutaValida(nombre: string): string {
    // Reemplazar espacios por guiones y convertir a minúsculas
    let ruta = nombre.toLowerCase().replace(/\s+/g, '-');

    // Eliminar caracteres especiales y acentos
    ruta = ruta.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Eliminar caracteres que no sean letras, números, guiones o barras
    ruta = ruta.replace(/[^a-z0-9-\/]/g, '');

    // Eliminar guiones al principio y al final
    ruta = ruta.replace(/^-+|-+$/g, '');

    // Agregar un guion al inicio si la cadena resultante está vacía
    if (ruta === '') {
      ruta = '-';
    }

    return ruta;
  }
}
