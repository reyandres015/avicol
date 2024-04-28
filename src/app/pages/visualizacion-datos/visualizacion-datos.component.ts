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

  constructor(
    private authService: UserAuthService,
    private granjaService: GranjaDataService,
    private galponService: GalponDataService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.authService.verifyUser().then((isLogged) => {
      if (!isLogged) {
        this.router.navigate(['/']);
      }
    })
    this.granjaSeleccionada = this.granjaService.getGranjaSeleccionada();
    this.galpon = this.galponService.getGalpon();
    //this.loadDataAndRenderChart();
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

  loadDataAndRenderChart() {
    if (!this.galpon || !this.galpon.ventas) return;
    
    const labels = this.galpon.ventas.map(venta => new Date(venta.fecha.toDate()).toLocaleDateString('es'));
    const data = this.galpon.ventas.map(venta => venta.totalVenta);

    const chartData = {
      labels: labels,
      datasets: [{
        label: 'Ventas por Fecha',
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
    if (canvas && this.isChartVisible) {  // Asegúrate de que el canvas existe y debe mostrarse
      const context = canvas.getContext('2d');
      if (context) {
        const myChart = new Chart(context, config);
      }
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