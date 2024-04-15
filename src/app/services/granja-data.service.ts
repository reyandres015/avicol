import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserAuthService } from './user-auth.service';
import { DocumentReference } from '@angular/fire/firestore';
import { GetDataFirebaseService } from './get-data-firebase.service';

@Injectable({
  providedIn: 'root'
})
export class GranjaDataService {
  private nombresGranjasUser: string[] = []

  private granjaSeleccionadaSubject = new BehaviorSubject<number>(-1);
  granjaSeleccionada$ = this.granjaSeleccionadaSubject.asObservable();

  constructor(
    private userAuth: UserAuthService,
    private getDataFirebase: GetDataFirebaseService
  ) { }

  setGranjas() {
    const arrayGranjasRef: DocumentReference[] = this.userAuth.getUser().granjas
    arrayGranjasRef.forEach(async (granjaRef) => {
      await this.getDataFirebase.getDocByReference(granjaRef).then((granja) => {
        this.nombresGranjasUser.push(granja.data().name)
      })
    })
  }

  actualizarGranjaSeleccionada(granja: number) {
    this.granjaSeleccionadaSubject.next(granja);
  }

  getNombresGranjasUser(): string[] {
    return this.nombresGranjasUser;
  }
}
