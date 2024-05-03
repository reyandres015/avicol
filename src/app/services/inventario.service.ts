import { Injectable } from '@angular/core';
import inventario from '../interfaces/inventario.interface';
import { GetDataFirebaseService } from './get-data-firebase.service';
import { GalponDataService } from './galpon-data.service';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(
    private getDataFirebase: GetDataFirebaseService,
    private galponDataService: GalponDataService
  ) { }

  inventario1: inventario[] = [];


  // Método para registrar un inventario
  async registrarInventario(inventario: inventario) {
    this.inventario1.push(inventario);
    let inventario1 = this.galponDataService.getGalpon().inventario;
    if (inventario1) {
      inventario1.push(inventario);
    } else {
      this.galponDataService.getGalpon().inventario = [inventario];
    }
    await this.updateInventario();
  }

  // Realiza la ejecucion de los update para todos los documentos de inventario pendientes por subir. (No internet conection)
  async updateInventario() {
    const refColeccionGalpon = this.galponDataService.getGalpon().ref + '/inventario';
    for (let i = 0; i < this.inventario1.length; i++) {
      await this.getDataFirebase.createDoc(refColeccionGalpon, this.inventario1[i]);
    }
  }
}
