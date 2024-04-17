import { Injectable } from '@angular/core';
import { GetDataFirebaseService } from './get-data-firebase.service';
import { GranjaDataService } from './granja-data.service';
import Galpon from '../interfaces/galpon.interface';

@Injectable({
  providedIn: 'root'
})
export class GalponDataService {
  private galponSeleccionado: Galpon = { name: '', ref: '', ventas: [], gastos: [] };

  constructor(
    private granjaService: GranjaDataService,
    private getDataFirebase: GetDataFirebaseService) {
  }

  async actualizarGalponSeleccionado(granja: number) {
    const galpones = this.granjaService.getGranjaSeleccionada().galpones
    if (galpones) {

      // Ventas de cada galpón
      await this.getDataFirebase.getCollectionDocs(`${galpones[granja].ref}/ventas`).then(async (ventasGalpon: any[]) => {
        let calculoTotalVentas: number = 0;
        for (let i = 0; i < ventasGalpon.length; i++) {
          await this.getDataFirebase.getDocByReference(ventasGalpon[i].ref).then((venta) => {
            calculoTotalVentas += venta.data().total;
            ventasGalpon[i] = {
              ...venta.data()
            }
          })

        }
        galpones[granja] = {
          ...galpones[granja],
          ventas: ventasGalpon,
          totalVentas: calculoTotalVentas
        }

      })
      this.galponSeleccionado = galpones[granja];
    } else {
      alert('Ocurrío un error al obtener la información del galpón. Por favor, intenta de nuevo.')
    }
  }

  getGalpon(): Galpon {
    return this.galponSeleccionado;
  }
}
