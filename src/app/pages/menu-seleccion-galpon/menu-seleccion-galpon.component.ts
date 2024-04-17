import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-menu-seleccion-galpon',
  templateUrl: './menu-seleccion-galpon.component.html',
  styleUrls: ['./menu-seleccion-galpon.component.scss']
})
export class MenuSeleccionGalponComponent implements OnInit {

  constructor(
    private authService: UserAuthService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.authService.verifyUser().then((isLogged) => {
      if (!isLogged) {
        this.router.navigate(['/']);
      }
    })
  }

  option(indexSelection: string) {
    this.router.navigate(['/' + indexSelection])
  }

  arrowBack() {
    window.history.back()
  }
}
