import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioSesionComponent } from './pages/inicio-sesion/inicio-sesion.component';
import { MenuGranjasComponent } from './pages/menu-granjas/menu-granjas.component';
import { GeneralGranjasComponent } from './pages/general-granjas/general-granjas.component';

const routes: Routes = [
  {
    path: '',
    component: InicioSesionComponent
  },
  {
    path: 'menu-granjas',
    component: MenuGranjasComponent
  },
  {
    path: 'vista-general-granja',
    component: GeneralGranjasComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
