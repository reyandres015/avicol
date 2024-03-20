import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  constructor() { }

  private actualCedulaUser: string = "";

  getActualCedulaUser(): string {
    return this.actualCedulaUser;
  }

  setActualCedulaUser(user: string) {
    this.actualCedulaUser = user;
  }

  async login(cedula: string, fechaNacimiento: string) {
    return this.actualCedulaUser;
  }
}
