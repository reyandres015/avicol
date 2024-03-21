import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioSesionComponent } from './pages/inicio-sesion/inicio-sesion.component';
import { MenuGranjasComponent } from './pages/menu-granjas/menu-granjas.component';

const routes: Routes = [
  {
    path: '',
    component: InicioSesionComponent
  },
  {
    path: 'menu-granjas',
    component: MenuGranjasComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
