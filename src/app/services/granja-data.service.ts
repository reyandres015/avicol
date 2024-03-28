import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GranjaDataService {
  private nombresGranjasUser: string[] = ['El Gonzal', 'El Recuerdo', 'Quinchita']

  private granjaSeleccionadaSubject = new BehaviorSubject<number>(-1);
  granjaSeleccionada$ = this.granjaSeleccionadaSubject.asObservable();

  constructor() { }

  actualizarGranjaSeleccionada(granja: number) {
    this.granjaSeleccionadaSubject.next(granja);
  }

  getNombresGranjasUser(): string[] {
    return this.nombresGranjasUser;
  }
}
