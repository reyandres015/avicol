import { Injectable } from '@angular/core';
import { GetDataFirebaseService } from './get-data-firebase.service';
import { GranjaDataService } from './granja-data.service';
import Galpon from '../interfaces/galpon.interface';

@Injectable({
  providedIn: 'root'
})
export class GalponDataService {
  private galponSeleccionado: Galpon = { name: '', ref: '', consecutivoVentas: 0, consecutivoGastos: 0, ventas: [], gastos: [], inventario: [] };
  private indexGalpon: number = 0;

  constructor(
    private granjaService: GranjaDataService,
    private getDataFirebase: GetDataFirebaseService) {
  }

  setIndexGalpon(index: number) {
    const galpones = this.granjaService.getGranjaSeleccionada().galpones //galpones de la granja seleccionada
    this.galponSeleccionado = galpones ? galpones[index] : { name: '', ref: '', consecutivoVentas: 0, consecutivoGastos: 0, ventas: [], gastos: [], inventario: [] };
  }

  async datosGalponSeleccionado() {
    const galpones = this.granjaService.getGranjaSeleccionada().galpones
    if (galpones) {
      // Ventas de cada galpón
      await this.getDataFirebase.getCollectionDocs(`${galpones[this.indexGalpon].ref}/ventas`).then(async (ventasGalpon: any[]) => {
        for (let i = 0; i < ventasGalpon.length; i++) {
          await this.getDataFirebase.getDocByReference(ventasGalpon[i].ref).then((venta) => {
            ventasGalpon[i] = {
              ...venta.data()
            }
          })
        }
        galpones[this.indexGalpon] = {
          ...galpones[this.indexGalpon],
          ventas: ventasGalpon,
        }
      })
      this.galponSeleccionado = galpones[this.indexGalpon];

      // Gastos de cada galpón
      await this.getDataFirebase.getCollectionDocs(`${galpones[this.indexGalpon].ref}/gastos`).then(async (gastosGalpon: any[]) => {
        for (let i = 0; i < gastosGalpon.length; i++) {
          await this.getDataFirebase.getDocByReference(gastosGalpon[i].ref).then((gasto) => {
            gastosGalpon[i] = {
              ...gasto.data()
            }
          })
        }
        galpones[this.indexGalpon] = {
          ...galpones[this.indexGalpon],
          gastos: gastosGalpon,
        }
      })
      this.galponSeleccionado = galpones[this.indexGalpon];
    } else {
      alert('Ocurrío un error al obtener la información del galpón. Por favor, intenta de nuevo.')
    }
  }

  getGalpon(): Galpon {
    return this.galponSeleccionado;
  }
}
