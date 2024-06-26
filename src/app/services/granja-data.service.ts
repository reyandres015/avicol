import { Injectable } from '@angular/core';
import { UserAuthService } from './user-auth.service';
import { DocumentReference } from '@angular/fire/firestore';
import { GetDataFirebaseService } from './get-data-firebase.service';
import Granja from '../interfaces/granja.interface';

@Injectable({
  providedIn: 'root'
})

// Servicio que se encarga de manejar la información de las granjas
export class GranjaDataService {
  private granjasUser: Granja[] = [];
  private granjaSeleccionada: Granja = { name: '', path: '' };

  constructor(
    private userAuth: UserAuthService,
    private getDataFirebase: GetDataFirebaseService
  ) { }

  // Menu de granjas disponibles por usuario
  setBasicGranjas() {
    const arrayGranjasRef: DocumentReference[] = this.userAuth.getUser().granjas;
    this.granjasUser = []; //Siempre que se vaya a llenar el arreglo, debe estar vacio.
    arrayGranjasRef.forEach(async (granjaRef) => {
      await this.getDataFirebase.getDocByReference(granjaRef).then((granja) => {
        const newGranja: Granja = {
          name: granja.data().name,
          path: granjaRef.path
        };
        this.granjasUser.push(newGranja);
      });
    });
  }

  // Función que devuelve las granjas del usuario
  getGranjasUser(): Granja[] {
    return this.granjasUser;
  }

  // Menú de galpones disponibles por usuarios
  async setTotalInfoGranja(DocPathGranja: string) {
    await this.getDataFirebase.getCollectionDocs(`${DocPathGranja}/galpones`).then((galponesGranja) => {

      // Se agrega la referencia del documento para cada galpon presente en la colección para poder acceder a la información de cada galpón.
      for (let i = 0; i < galponesGranja.length; i++) {
        galponesGranja[i] = {
          ...galponesGranja[i].data(),
          ref: galponesGranja[i].ref.path
        };
      }

      // Se actualiza la granja seleccionada con la información de sus galpones
      this.granjaSeleccionada = {
        ...this.granjaSeleccionada,
        galpones: galponesGranja
      };
    });
  }

  // Función que devuelve la granja seleccionada
  getGranjaSeleccionada(): Granja {
    return this.granjaSeleccionada;
  }

  // Función que actualiza la granja seleccionada
  actualizarGranjaSeleccionada(granja: number) {
    this.granjaSeleccionada = this.granjasUser[granja];
  }
}
