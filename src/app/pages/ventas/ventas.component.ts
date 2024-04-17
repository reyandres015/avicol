import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
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

}
