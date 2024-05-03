import { Injectable } from '@angular/core';
import { GetDataFirebaseService } from './get-data-firebase.service';
import { GranjaDataService } from './granja-data.service';
import Galpon from '../interfaces/galpon.interface';

@Injectable({
  providedIn: 'root'
})
export class GalponDataService {
  private galponSeleccionado: Galpon = { name: '', ref: '', ventas: [], gastos: [], inventario: [] };

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
            calculoTotalVentas += venta.data().totalVenta;
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

      // Gastos de cada galpón
      await this.getDataFirebase.getCollectionDocs(`${galpones[granja].ref}/gastos`).then(async (gastosGalpon: any[]) => {
        let calculoTotalGastos: number = 0;
        for (let i = 0; i < gastosGalpon.length; i++) {
          await this.getDataFirebase.getDocByReference(gastosGalpon[i].ref).then((gasto) => {
            calculoTotalGastos += gasto.data().total;
            gastosGalpon[i] = {
              ...gasto.data()
            }
          })
        }
        galpones[granja] = {
          ...galpones[granja],
          gastos: gastosGalpon,
          totalGastos: calculoTotalGastos
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
