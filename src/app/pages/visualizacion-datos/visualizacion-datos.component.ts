import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { GalponDataService } from 'src/app/services/galpon-data.service';
import { GranjaDataService } from 'src/app/services/granja-data.service';
import Galpon from 'src/app/interfaces/galpon.interface';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import Gastos from 'src/app/interfaces/gastos.interface';
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
  isChartsVisible2: boolean = false;
  isGastosChartVisible: boolean = false;
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
        this.loadGastoDataAndRenderChart();
        //this.loadLineChartDataAndRenderChart();
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
    const target = event.target as HTMLSelectElement;  
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

  loadGastoDataAndRenderChart() {
    if (!this.galpon || !this.galpon.gastos) return;
  
    // Lógica para generar el gráfico de torta para gastos
    const gastosAgrupados = this.agruparGastosPorConcepto();
    const totalGastos = gastosAgrupados.reduce((sum, current) => sum + current.total, 0);
    const labels = gastosAgrupados.map(g => `${g.concepto} (${((g.total / totalGastos) * 100).toFixed(0)}%)`);
    const data = gastosAgrupados.map(g => g.total);
  
    const chartData = {
      labels: labels,
      datasets: [{
        label: 'Gastos por Concepto',
        data: data,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'
        ]
      }]
    };
  
    const config: ChartConfiguration<'pie', number[], string> = {
      type: 'pie',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#F8F8FF'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false
          },
        }
      }
    };
  
    const canvas = document.getElementById('gastosChart') as HTMLCanvasElement | null;  // Especifica que puede ser null
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        new Chart(context, config);
      }
    }
  }

  loadLineChartDataAndRenderChart() {
    if (!this.galpon || !this.galpon.ventas || !this.galpon.gastos) {
        console.error("Datos de ventas o gastos no disponibles.");
        return;
    }

    console.log("Gastos originales:", this.galpon.gastos);

    // Usamos la nueva función para agrupar los gastos por día
    const gastosAgrupados = this.agruparGastosPorDia(this.galpon.gastos);
    const gastosData = gastosAgrupados.map(group => group.total);
    const labels = gastosAgrupados.map(group => group.fecha);
    const ventasData = this.agruparDatos(this.galpon.ventas, 'diario').map(group => group.totalVenta);

    console.log("Datos de Gastos:", gastosData);
    console.log("Datos de Ventas:", ventasData);
    console.log("Etiquetas:", labels);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Gastos',
                data: gastosData,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            },
            {
                label: 'Ventas',
                data: ventasData,
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1
            }
        ]
    };

    const config: ChartConfiguration<'line'> = {
        type: 'line',
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.5)',
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)',
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.5)',
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)',
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                    }
                },
                tooltip: {
                    callbacks: {
                        labelColor: function(context) {
                            return {
                                borderColor: 'rgba(0, 0, 0, 0)',
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                borderWidth: 2,
                                borderDash: [2, 2],
                                borderRadius: 2,
                            };
                        },
                        labelTextColor: function() {
                            return 'rgba(255, 255, 255, 0.8)';
                        }
                    }
                }
            }
        }
    };

    const canvas = document.getElementById('lineChart') as HTMLCanvasElement;
    if (canvas && this.isChartsVisible2) {
        const context = canvas.getContext('2d');
        if (context) {
            if (this.currentChart) {
                this.currentChart.destroy();
            }
            this.currentChart = new Chart(context, config);
        } else {
            console.error("No se pudo obtener el contexto del canvas para el gráfico de líneas.");
        }
    } else {
        console.error("Elemento canvas para el gráfico de líneas no encontrado.");
    }
  }

  agruparGastosPorDia(gastos: any[]): any[] {
    const gastosAgrupados = gastos.reduce((acumulador, gasto) => {
      const fecha = new Date(gasto.fecha.toDate());
      const fechaClave = fecha.getFullYear() + '-' + ('0' + (fecha.getMonth() + 1)).slice(-2) + '-' + ('0' + fecha.getDate()).slice(-2);
  
      if (acumulador[fechaClave]) {
        acumulador[fechaClave].total += gasto.total;
      } else {
        acumulador[fechaClave] = {
          fecha: fechaClave,
          total: gasto.total
        };
      }
      return acumulador;
    }, {});
  
    return Object.values(gastosAgrupados);
  }

  agruparGastosPorConcepto() {
    if (!this.galpon.gastos) return [];
  
    return this.galpon.gastos.reduce((acum, gasto) => {
      const existente = acum.find(item => item.concepto === gasto.concepto);
      if (existente) {
        existente.total += gasto.total;
      } else {
        acum.push({ ...gasto });
      }
      return acum;
    }, [] as Gastos[]);  
  }

  agruparDatos(ventas: any[], intervalo: string): any[] {
    if (intervalo === 'por_cliente') {
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
    }
  }
  
  toggleChartsVisibility2() {
    this.isChartsVisible2 = !this.isChartsVisible2;
    if (this.isChartsVisible2) {
        setTimeout(() => {
            this.loadGastoDataAndRenderChart();
            this.loadLineChartDataAndRenderChart();
        }, 0); 
    }
  }
}