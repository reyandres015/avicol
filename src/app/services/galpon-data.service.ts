import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GalponDataService {
  private nombresGalponUser: string[] = ['Galpón 1', 'Galpón 2', 'Galpón 3', 'Galpón 4']

  private galponSeleccionadoSubject = new BehaviorSubject<number>(-1);
  galponSeleccionada$ = this.galponSeleccionadoSubject.asObservable();

  constructor() { }

  actualizarGalponSeleccionado(granja: number) {
    this.galponSeleccionadoSubject.next(granja);
  }

  getNombresGalponUser(): string[] {
    return this.nombresGalponUser;
  }
}
