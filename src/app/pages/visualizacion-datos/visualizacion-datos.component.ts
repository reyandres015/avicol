import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { GalponDataService } from 'src/app/services/galpon-data.service';
import { GranjaDataService } from 'src/app/services/granja-data.service';
import Galpon from 'src/app/interfaces/galpon.interface';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-visualizacion-datos',
  templateUrl: './visualizacion-datos.component.html',
  styleUrls: ['./visualizacion-datos.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }]
})
export class VisualizacionDatosComponent implements OnInit {
  granjaSeleccionada: any = { name: '', path: '' };
  galpon: Galpon = { name: '', ref: '', totalVentas: 0, totalGastos: 0, ventas: [], gastos: [] };
  isChartVisible: boolean = false;
  intervaloSeleccionado: string = 'por_cliente';
  currentChart: Chart | null = null;

  constructor(
    private authService: UserAuthService,
    private granjaService: GranjaDataService,
    private galponService: GalponDataService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.authService.verifyUser().then((isLogged) => {
      if (!isLogged) {
        this.router.navigate(['/']);
      } else {
        this.granjaSeleccionada = this.granjaService.getGranjaSeleccionada();
        this.galpon = this.galponService.getGalpon();
        // Llama inicialmente a cargar y renderizar el gráfico
        this.loadDataAndRenderChart();
      }
    })
  }

  arrowBack() {
    window.history.back()
  }

  moneyFormat(money: number) {
    return money.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  cambiarIntervalo(event: Event) {
    const target = event.target as HTMLSelectElement;  // Aserción de tipo
    const valor = target.value;
    if (valor) {
      this.intervaloSeleccionado = valor;
      this.loadDataAndRenderChart();
    } else {
      console.error('Intervalo de tiempo no seleccionado.');
    }
  }

  loadDataAndRenderChart() {
    if (!this.galpon || !this.galpon.ventas) return;
    
    if (this.currentChart) {
      this.currentChart.destroy();
    }
  
    let agrupado = this.agruparDatos(this.galpon.ventas, this.intervaloSeleccionado);
    const labels = this.intervaloSeleccionado === 'por_cliente' ? agrupado.map(group => group.cliente) : agrupado.map(group => group.fecha);
    const data = agrupado.map(group => group.totalVenta);
  
    const chartData = {
      labels: labels,
      datasets: [{
        label: this.intervaloSeleccionado === 'por_cliente' ? 'Ventas por Cliente' : 'Ventas por Fecha',
        data: data,
        backgroundColor: '#002D4E',
        borderColor: '#002D4E',
        borderWidth: 1
      }]
    };
  
    const config: ChartConfiguration = {
      type: 'bar',
      data: chartData,
      options: {
        scales: {
          y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.5)',
              },
              ticks: {
                color:'#ffffff',
              }
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.5)', 
              },
              ticks: {
                color: '#ffffff', 
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: '#ffffff', 
              }
            }
          }
        }
      };
  
    const canvas = <HTMLCanvasElement>document.getElementById('ventasChart');
    if (canvas && this.isChartVisible) {
      const context = canvas.getContext('2d');
      if (context) {
        this.currentChart = new Chart(context, config);
      }
    }
  }

  agruparDatos(ventas: any[], intervalo: string): any[] {
    if (intervalo === 'por_cliente') {
      // Agrupa y suma las ventas por cliente
      const ventasPorCliente = ventas.reduce((acum, venta) => {
        const cliente = venta.cliente;
        if (acum[cliente]) {
          acum[cliente].totalVenta += venta.totalVenta;
        } else {
          acum[cliente] = {
            cliente: cliente,
            totalVenta: venta.totalVenta
          };
        }
        return acum;
      }, {});
  
      // Convertir el objeto acumulador en un array para el gráfico
      return Object.values(ventasPorCliente);
    } else {
      switch (intervalo) {
        case 'diario':
          return ventas.reduce(this.agruparPor('fecha'), []);
        case 'semanal':
          return ventas.reduce(this.agruparPor('semana'), []);
        case 'mensual':
          return ventas.reduce(this.agruparPor('mes'), []);
        case 'anual':
          return ventas.reduce(this.agruparPor('año'), []);
        default:
          return [];
      }
    }
  }

  agruparPor(key: string) {
    return (acumulador: any[], valorActual: any) => {
      let fecha = new Date(valorActual.fecha.toDate());
      let grupo = this.determinarGrupo(fecha, key);
      let grupoExistente = acumulador.find(g => g.fecha === grupo);
      if (grupoExistente) {
        grupoExistente.totalVenta += valorActual.totalVenta;
      } else {
        acumulador.push({ fecha: grupo, totalVenta: valorActual.totalVenta });
      }
      return acumulador;
    }
  }

  determinarGrupo(fecha: Date, key: string): string {
    switch (key) {
      case 'fecha':
        return fecha.toLocaleDateString('es');
      case 'semana':
        let primerDia = new Date(fecha.setDate(fecha.getDate() - fecha.getDay()));
        let ultimoDia = new Date(primerDia);
        ultimoDia.setDate(primerDia.getDate() + 6);
        return `${primerDia.toLocaleDateString('es')} - ${ultimoDia.toLocaleDateString('es')}`;
      case 'mes':
        return `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
      case 'año':
        return `${fecha.getFullYear()}`;
      default:
          return "No especificado";
    }
  }

  toggleChartVisibility() {
    this.isChartVisible = !this.isChartVisible;
    if (this.isChartVisible) {
      setTimeout(() => this.loadDataAndRenderChart(), 0);
      // Se utiliza setTimeout para esperar a que Angular actualice la vista.
    }
  }
}