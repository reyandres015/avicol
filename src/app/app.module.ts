import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuGranjasComponent } from './pages/menu-granjas/menu-granjas.component';
import { InicioSesionComponent } from './pages/inicio-sesion/inicio-sesion.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuGranjasComponent,
    InicioSesionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
