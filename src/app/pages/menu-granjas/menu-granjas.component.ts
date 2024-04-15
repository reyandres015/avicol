import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GranjaDataService } from 'src/app/services/granja-data.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-menu-granjas',
  templateUrl: './menu-granjas.component.html',
  styleUrls: ['./menu-granjas.component.scss']
})
export class MenuGranjasComponent implements OnInit {
  granjas: string[] = [];
  granja: string = '';

  constructor(
    private router: Router,
    private granjaService: GranjaDataService,
    private authService: UserAuthService
  ) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn) {
      this.router.navigate([''])
    }
    this.granjaService.setGranjas();
    this.granjas = this.granjaService.getNombresGranjasUser();
  }

  option(indexSelection: number) {
    this.granjaService.actualizarGranjaSeleccionada(indexSelection);
    this.router.navigate(['/vista-general-granja'])
  }
}
