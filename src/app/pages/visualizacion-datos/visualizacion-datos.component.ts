import { Component } from '@angular/core';

@Component({
  selector: 'app-visualizacion-datos',
  templateUrl: './visualizacion-datos.component.html',
  styleUrls: ['./visualizacion-datos.component.scss']
})
export class VisualizacionDatosComponent {
  galpones: string[] = [];
  galpon: string = '';

  nombreGranja: string = "no data";
  nombreGalpon: string = "no data";

  ventasTotales: string = '0';

  constructor() { }

  arrowBack() {
    window.history.back()
  }

  moneyFormat(money: string) {
    const translateMoney = parseInt(money)
    return translateMoney.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
}
