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
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';

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
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
