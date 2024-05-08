import { Injectable } from '@angular/core';
import Ventas from '../interfaces/ventas.interface';
import { GalponDataService } from './galpon-data.service';
import { GetDataFirebaseService } from './get-data-firebase.service';

@Injectable({
  providedIn: 'root'
})
export class RealizarVentasService {

  constructor(
    private galponDataService: GalponDataService,
    private getDataFirebase: GetDataFirebaseService
  ) { }

  // ventas: Ventas[] = [];

  // Método para registrar una venta
  async registrarVenta(venta: Ventas) {
    // this.ventas.push(venta);
    let ventas = this.galponDataService.getGalpon().ventas;
    if (ventas) {
      ventas.push(venta);
    } else {
      this.galponDataService.getGalpon().ventas = [venta];
    }
    await this.updateVenta(venta);
  }

  // Realiza la ejecucion de los update para todos los documentos de ventas pendientes por subir. (No internet conection) - POR DESARROLLAR
  async updateVenta(venta: Ventas) {
    const refColeccionGalpon = this.galponDataService.getGalpon().ref + '/ventas';
    // for (let i = 0; i < this.ventas.length; i++) {
    await this.getDataFirebase.createDoc(refColeccionGalpon, venta);
    const galpon = this.galponDataService.getGalpon();
    if (galpon.ventasTotales) {
      galpon.ventasTotales += venta.totalVenta;
    } else {
      galpon.ventasTotales = venta.totalVenta;
    }
    await this.getDataFirebase.updateDoc(this.galponDataService.getGalpon().ref, { ventasTotales: galpon.ventasTotales });
    // }
  }
}
