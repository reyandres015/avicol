import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioService } from 'src/app/services/inventario.service';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/services/user-auth.service';
import inventario from 'src/app/interfaces/inventario.interface';
import { Timestamp } from '@angular/fire/firestore';


@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss'],
})

export class InventarioComponent implements OnInit {
  constructor( 
    private authService: UserAuthService, 
    private router: Router, 
    private inventarioService: InventarioService
  ){} 

  inventario: inventario = {
    fecha: Timestamp.now(),
    detalle: [],
    TotalInventario: 0
  }



async ngOnInit() {
  await this.authService.verifyUser().then((isLogged) => {
    if (!isLogged) {
      this.router.navigate(['/']);
    }
  })
}


async crearInventario() {
  this.inventario.detalle = []
  for (const k of this.getKeysObject(this.filas)) {
    if (this.filas[k].cantidad() != '0' && this.filas[k].total() != '0') {
    //  this.inventario.detalle.push({
      //  tipo: k,
      //  cantidad: this.filas[k].cantidad(),
      //  total: this.filas[k].total()
    //  });
    } else {
      alert(`Por favor complete todos los campos de la fila del producto tipo ${k}`);
      return;
    }
  }

  await this.inventarioService.registrarInventario(this.inventario);
  alert('Inventario registrado con éxito');

}

filas: {
  [key: string]: { cantidad: any, valorUnitario: any, total: any }
} = {
    'C': {
      cantidad: signal(0),
      valorUnitario: signal(0),
      total: signal(0)
    },
    'B': {
      cantidad: signal(0),
      valorUnitario: signal(0),
      total: signal(0)
    },
    'A': {
      cantidad: signal(0),
      valorUnitario: signal(0),
      total: signal(0)
    },
    'AA': {
      cantidad: signal(0),
      valorUnitario: signal(0),
      total: signal(0)
    },
    'EX': {
      cantidad: signal(0),
      valorUnitario: signal(0),
      total: signal(0)
    },
    'JUM': {
      cantidad: signal(0),
      valorUnitario: signal(0),
      total: signal(0)
    },
    'OTRO': {
      cantidad: signal(0),
      valorUnitario: signal(0),
      total: signal(0)
    }
  };

  //funcion para obtener las llaves de cualquier objeto
  getKeysObject(obj: {}) {
    return Object.keys(obj);
  }

  //funcion para cambiar cantidad
  changeCantidad(key: string, event: Event) {
    const htmlElement = (event.target as HTMLInputElement);
    let value = htmlElement.value.replaceAll('$', '');
    value = value.replaceAll(',', '');

    this.filas[key].cantidad.set(value);
    this.calcularTotal(key);
  }

    //funcion para calcular el total
    calcularTotal(key: string) {
      const total = this.filas[key].cantidad() * this.filas[key].valorUnitario();
      this.filas[key].total.set(total);
      // sumar el total de todas las filas
      this.inventario.TotalInventario = 0;
      for (const k of this.getKeysObject(this.filas)) {
        this.inventario.TotalInventario += this.filas[k].total();
      }
    }


}