import { Injectable } from '@angular/core';
import Gastos from '../interfaces/gastos.interface';
import { GalponDataService } from './galpon-data.service';
import { GetDataFirebaseService } from './get-data-firebase.service';

@Injectable({
  providedIn: 'root'
})
export class RealizarGastoService {

  constructor(
    private galponDataService: GalponDataService,
    private getDataFirebase: GetDataFirebaseService
  ) { }

  gastos: Gastos[] = [];

  async registrarGasto(gasto: Gastos) {
    this.gastos.push(gasto);
    let gastosGalpon = this.galponDataService.getGalpon().gastos;
    if (gastosGalpon) {
      gastosGalpon.push(gasto);
    } else {
      this.galponDataService.getGalpon().gastos = [gasto];
    }
    await this.updateVenta();
  }

  // Realiza la ejecucion de los update para todos los documentos de ventas pendientes por subir. (No internet conection)
  async updateVenta() {
    const refColeccionGalpon = this.galponDataService.getGalpon().ref + '/gastos';
    for (let i = 0; i < this.gastos.length; i++) {
      await this.getDataFirebase.createDoc(refColeccionGalpon, this.gastos[i]);
    }
  }
}
