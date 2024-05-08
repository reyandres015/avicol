import { CommonModule, formatCurrency } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms'; 

import Ventas from 'src/app/interfaces/ventas.interface';
import { RealizarVentasService } from 'src/app/services/realizar-ventas.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
  items: any[] = [];
  constructor(
    private authService: UserAuthService,
    private router: Router,
    private ventasService: RealizarVentasService
  ) { }

  async ngOnInit() {
    await this.authService.verifyUser().then((isLogged) => {
      if (!isLogged) {
        this.router.navigate(['/']);
      }
    })
  }

  fecha: Date = new Date();
  hora: Date = new Date();

  venta: Ventas = {
    fecha: Timestamp.now(),
    cliente: "",
    detalle: [],
    totalVenta: 0
  }

  async crearVenta() {
    this.venta.detalle = []
    for (const k of this.getKeysObject(this.filas)) {

      //verificar que todos los atributos de venta esten completos
      if (this.filas[k].cantidad() != '0' && this.filas[k].valorUnitario() != '0' && this.venta.cliente != '') {
        this.venta.detalle.push({
          tipo: k,
          cantidad: this.filas[k].cantidad(),
          valorUnitario: this.filas[k].valorUnitario(),
          total: this.filas[k].total()
        });
      }
    }
    if (this.venta.detalle.length == 0 || this.venta.cliente == '') {
      alert(`Por favor complete todos los campos de la fila a registrar o ingrese un cliente valido`);
      return;
    }

    await this.ventasService.registrarVenta(this.venta);
    alert('Venta registrada con éxito');
  }

  reiniciarVenta() {
    this.venta = {
      fecha: Timestamp.now(),
      cliente: "",
      detalle: [],
      totalVenta: 0
    }
    for (const k of this.getKeysObject(this.filas)) {
      this.filas[k].cantidad.set(0);
      this.filas[k].valorUnitario.set(0);
      this.filas[k].total.set(0);
    }
  }

  setFecha(event: Event) {
    const htmlElement = (event.target as HTMLInputElement);
    let fechaParts = htmlElement.value.split('-');
    let fecha = new Date(Number(fechaParts[0]), Number(fechaParts[1]) - 1, Number(fechaParts[2]));
    this.venta.fecha = Timestamp.fromDate(fecha);
    // obtener hora actual
    this.hora = new Date();
  }

  // filas de la tabla
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
      }
    };

  //funcion para obtener las llaves de cualquier objeto
  getKeysObject(obj: {}) {
    return Object.keys(obj);
  }

  setCliente(event: Event) {
    const htmlElement = (event.target as HTMLInputElement);
    this.venta.cliente = htmlElement.value;
  }

  //funcion para cambiar cantidad
  changeCantidad(key: string, event: Event) {
    const htmlElement = (event.target as HTMLInputElement);
    let value = htmlElement.value.replaceAll('$', '');
    value = value.replaceAll(',', '');

    this.filas[key].cantidad.set(value);
    this.calcularTotal(key);
  }

  //funcion para cambiar valor unitario
  changeValorUnitario(key: string, event: Event) {
    const htmlElement = (event.target as HTMLInputElement);
    let value = htmlElement.value.replaceAll('$', '');
    value = value.replaceAll(',', '');

    this.filas[key].valorUnitario.set(value);
    this.calcularTotal(key);
  }

  //funcion para calcular el total
  calcularTotal(key: string) {
    const total = this.filas[key].cantidad() * this.filas[key].valorUnitario();
    this.filas[key].total.set(total);
    // sumar el total de todas las filas
    this.venta.totalVenta = 0;
    for (const k of this.getKeysObject(this.filas)) {
      this.venta.totalVenta += this.filas[k].total();
    }
  }

  //funcion para dar formato a la moneda
  formatCurrency(event: any) {
    let input = parseFloat(event.target.value.replace(/[^0-9.]/g, ''));
    if (!isNaN(input)) {
      event.target.value = formatCurrency(input, 'en', '$', 'USD', '1.0-0');
    } else {
      event.target.value = '$';
    }
  }

  arrowBack() {
    window.history.back()
  }

  addInitialRow() {
    const newItem = { tipo: '', cantidad: 0, valorUnitario: 0, total: 0 };
    this.items.push(newItem); // Añade una nueva fila inicialmente editable
  }

  selectTipo(index: number) {
    this.items[index].tipoSelected = !this.items[index].tipoSelected; 
    this.items[index].tipo = 'Tipo Seleccionado'; // Cambia el tipo a uno seleccionado
  }
}
