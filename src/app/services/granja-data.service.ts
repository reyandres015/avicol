import { Injectable } from '@angular/core';
import { UserAuthService } from './user-auth.service';
import { DocumentReference } from '@angular/fire/firestore';
import { GetDataFirebaseService } from './get-data-firebase.service';
import Granja from '../interfaces/granja.interface';

@Injectable({
  providedIn: 'root'
})
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

  getGranjasUser(): Granja[] {
    return this.granjasUser;
  }

  // Menú de galpones disponibles por usuarios
  async setTotalInfoGranja(DocPathGranja: string) {
    await this.getDataFirebase.getCollectionDocs(`${DocPathGranja}/galpones`).then((galponesGranja) => {
      this.granjaSeleccionada = {
        ...this.granjaSeleccionada,
        galpones: galponesGranja
      };
    });
  }

  getGranjaSeleccionada(): Granja {
    return this.granjaSeleccionada;
  }

  actualizarGranjaSeleccionada(granja: number) {
    this.granjaSeleccionada = this.granjasUser[granja];
  }
}
