import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuGranjasComponent } from './pages/menu-granjas/menu-granjas.component';
import { InicioSesionComponent } from './pages/inicio-sesion/inicio-sesion.component';
import { GeneralGranjasComponent } from './pages/general-granjas/general-granjas.component';
import { MenuSeleccionGalponComponent } from './pages/menu-seleccion-galpon/menu-seleccion-galpon.component';
import { VisualizacionDatosComponent } from './pages/visualizacion-datos/visualizacion-datos.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { GastosComponent } from './pages/gastos/gastos.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuGranjasComponent,
    InicioSesionComponent,
    GeneralGranjasComponent,
    MenuSeleccionGalponComponent,
    VisualizacionDatosComponent,
    VentasComponent,
    GastosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
