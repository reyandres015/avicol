import { Injectable, NgZone } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  userCredentials: any;

  constructor(private firebaseAuthenticationService: AngularFireAuth,
    private ngZone: NgZone,
    private router: Router
  ) { 

    this.firebaseAuthenticationService.authState.subscribe(user => {
      if (user) {
        this.userCredentials = user;
        localStorage.setItem('user', JSON.stringify(this.userCredentials));
      } else {
        localStorage.setItem('user', 'null');
      }
    })
  }


  //generar el inicio de sesion
  async login(email: string, password: string) {
    return this.firebaseAuthenticationService.signInWithEmailAndPassword(email, password)
    .then((userCredentials) => {
      this.userCredentials = userCredentials.user;
      this.observeUserState();
  })
  .catch((error) => {
    console.error(error.message + ' Por favor, intenta de nuevo');
  });
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

}
