import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GranjaDataService } from 'src/app/services/granja-data.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

import { trigger, transition, style, animate } from '@angular/animations';
import Granja from 'src/app/interfaces/granja.interface';
@Component({
  selector: 'app-menu-granjas',
  templateUrl: './menu-granjas.component.html',
  styleUrls: ['./menu-granjas.component.scss'],
  animations: [
    trigger('fadeInOutFast', [
      transition(':enter', [
        style({ opacity: 0, height: 0 }),
        animate('0.2s linear', style({ opacity: 1, height: '*' })) // '*' indica que se usará la altura actual
      ]),
      transition(':leave', [
        animate('0.2s linear', style({ opacity: 0 }))
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.6s ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.6s ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MenuGranjasComponent implements OnInit {
  granjas: Granja[] = [];

  constructor(
    private router: Router,
    private granjaService: GranjaDataService,
    private authService: UserAuthService
  ) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['']);
    }
    this.granjaService.setBasicGranjas();
    this.granjas = this.granjaService.getGranjasUser();
  }

  async option(indexSelection: number) {
    this.granjaService.actualizarGranjaSeleccionada(indexSelection);
    await this.granjaService.setTotalInfoGranja(this.granjas[indexSelection].path);
    this.router.navigate(['/vista-general-granja']);
  }
}
