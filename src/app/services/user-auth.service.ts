import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import User from '../interfaces/user.interface';
import { GetDataFirebaseService } from './get-data-firebase.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private user: User = {
    name: "",
    uid: "",
    granjas: [],
  }
  userCredentials: any;
  constructor(
    private firebaseAuthenticationService: AngularFireAuth,
    private ngZone: NgZone,
    private router: Router,
    private getDataFirebase: GetDataFirebaseService
  ) { }


  //generar el inicio de sesion
  async login(email: string, password: string) {
    return this.firebaseAuthenticationService.signInWithEmailAndPassword(email, password)
      .then(async (userCredentials) => {
        this.userCredentials = userCredentials.user;
        await this.getUserData(this.userCredentials);
        this.observeUserState();
      }).catch((error) => {
        console.error(error.message + ' Por favor, intenta de nuevo');
      });
  }

  async logout() {
    return this.firebaseAuthenticationService.signOut().then(() => {
      this.router.navigate(['']);
    })
  }

  observeUserState() {
    this.firebaseAuthenticationService.authState.subscribe((userState) => {
      userState && this.ngZone.run(() => this.router.navigate(['menu-granjas']));
    })
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  async verifyUser() {
    return await this.firebaseAuthenticationService.currentUser.then((user) => {
      return user ? true : false;
    })
  }

  async getUserData(userCredentials: any) {
    const uid: string = userCredentials.uid

    await this.getDataFirebase.getDocByPath(`usuarios/${uid}`).then((userDataDoc) => {
      if (userDataDoc) {
        const userData: any = userDataDoc.data()
        this.user = {
          name: userData.name,
          uid: uid,
          granjas: userData.granjas,
        }
      }
    })
  }

  getUser() {
    return this.user;
  }
}
