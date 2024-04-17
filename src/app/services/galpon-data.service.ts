import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GetDataFirebaseService } from './get-data-firebase.service';
import { UserAuthService } from './user-auth.service';
import { DocumentReference, DocumentData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GalponDataService {
  private nombresGalponUser: string[] = []

  private galponSeleccionadoSubject = new BehaviorSubject<number>(-1);
  galponSeleccionada$ = this.galponSeleccionadoSubject.asObservable();

  constructor(   
    private userAuth: UserAuthService,
    private getDataFirebase: GetDataFirebaseService ) {
  }

  actualizarGalponSeleccionado(granja: number) {
    this.galponSeleccionadoSubject.next(granja);
  }

  getNombresGalponUser(): string[] {
    return this.nombresGalponUser;
  }
}
