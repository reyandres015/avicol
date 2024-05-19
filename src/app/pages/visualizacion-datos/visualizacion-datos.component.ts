import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { GalponDataService } from 'src/app/services/galpon-data.service';
import { GranjaDataService } from 'src/app/services/granja-data.service';
import Galpon from 'src/app/interfaces/galpon.interface';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import Gastos from 'src/app/interfaces/gastos.interface';
import Ventas from 'src/app/interfaces/ventas.interface';
Chart.register(...registerables);

@Component({
  selector: 'app-visualizacion-datos',
  templateUrl: './visualizacion-datos.component.html',
  styleUrls: ['./visualizacion-datos.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }]
})
export class VisualizacionDatosComponent implements OnInit {
  granjaSeleccionada: any = { name: '', path: '' };
  galpon: Galpon = { name: '', ref: '', consecutivoVentas: 0, consecutivoGastos: 0, ventasTotales: 0, gastosTotales: 0, ventas: [], gastos: [] };
  ventasGalpon: Ventas[] = [];
  gastosGalpon: Gastos[] = [];

  path: { name: string, path: string }[] = [];

  mostrarVentas: boolean = true;
  mostrarGastos: boolean = false;
  mostrarGraficas: boolean = false;

  intervaloSeleccionado: string = 'por_cliente';

  ventasChart: Chart | null = null;
  lineChart: Chart | null = null;

  chargeIco: boolean = false;

  constructor(
    private authService: UserAuthService,
    private granjaService: GranjaDataService,
    private galponService: GalponDataService,
    private router: Router
  ) { }

  ventasGalponGrupo: any[] = [];
  currentPageVentas: number = 0;
  gastosGalponGrupo: any[] = [];
  currentPageGastos: number = 0;

  changePage(currentPage: number, cambio: number, length: number) {
    currentPage += cambio
    if (currentPage < 0) {
      currentPage = length - 1;
    }

    if (currentPage >= length) {
      currentPage = 0;
    }
    return currentPage;
  }

  async ngOnInit() {
    await this.authService.verifyUser().then(async (isLogged) => {
      if (!isLogged) {
        this.router.navigate(['/']);
      } else {
        const refGranja = this.granjaService.getGranjaSeleccionada().path.split('/').pop();
        const refGalpon = this.galponService.getGalpon().ref.split('/').pop();
        if (refGranja && refGalpon) {
          this.path = [
            { name: 'granjas', path: 'menu-granjas' },
            { name: refGranja, path: 'vista-general-granjas' },
            { name: 'galpones', path: 'vista-general-granjas' },
            { name: refGalpon, path: 'vista-general-granjas' },
            { name: 'visualización-datos', path: 'visualizacion-datos' }
          ];
        }

        this.granjaSeleccionada = this.granjaService.getGranjaSeleccionada();

        this.chargeIco = true;
        // Descargar los datos del galpón seleccionado
        await this.galponService.datosGalponSeleccionado();
        this.galpon = this.galponService.getGalpon();

        // Ventas
        this.ventasGalpon = this.galpon?.ventas || [];
        // organizar ventasGalpon por fecha
        this.ventasGalpon.sort((a, b) => a.id - b.id);

        // Dividir en grupos de 5

        for (let i = 0; i < this.ventasGalpon.length; i += 5) {
          let grupo = this.ventasGalpon.slice(i, i + 5);
          this.ventasGalponGrupo.push(grupo);
        }

        this.gastosGalpon = this.galpon?.gastos || [];
        // organizar gastosGalpon por fecha
        this.gastosGalpon.sort((a, b) => a.id - b.id);

        //dividir en grupos de 5
        for (let i = 0; i < this.gastosGalpon.length; i += 5) {
          let grupo = this.gastosGalpon.slice(i, i + 5);
          this.gastosGalponGrupo.push(grupo);
        }

        this.chargeIco = false;

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

    if (this.ventasChart) {
      this.ventasChart.destroy();
    }

    let agrupado = this.agruparDatos(this.galpon.ventas, this.intervaloSeleccionado);
    let labels = this.intervaloSeleccionado === 'por_cliente' ? agrupado.map(group => group.cliente) :
      this.intervaloSeleccionado === 'por_tipo' ? agrupado.map(group => group.tipo) :
        agrupado.map(group => group.fecha);
    let data = this.intervaloSeleccionado === 'por_tipo' ? agrupado.map(group => group.cantidad) :
      agrupado.map(group => group.totalVenta);
    let labelDescriptor = this.intervaloSeleccionado === 'por_cliente' ? 'Ventas por Cliente' :
      this.intervaloSeleccionado === 'por_tipo' ? 'Cantidad de Ventas por Tipo de Huevo' :
        'Ventas por Fecha';

    const chartData = {
      labels: labels,
      datasets: [{
        label: labelDescriptor,
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
              color: '#ffffff',
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
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        this.ventasChart = new Chart(context, config);
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

    // Asegúrate de que las ventas y los gastos están definidos antes de proceder
    const ventas = this.galpon.ventas ?? [];
    const gastos = this.galpon.gastos ?? [];

    // Fusionar y ordenar todas las fechas de ventas y gastos en un solo array de fechas únicas
    const fechasVentas = ventas.map(v => v.fecha.toDate().getTime());
    const fechasGastos = gastos.map(g => g.fecha.toDate().getTime());
    const todasLasFechas = [...new Set([...fechasVentas, ...fechasGastos])].sort((a, b) => a - b);

    // Convertir las fechas de milisegundos a formato legible
    const fechasFormato = todasLasFechas.map(ms => new Date(ms).toLocaleDateString('es'));

    // Preparar los datos de ventas y gastos para la gráfica en base a las fechas unificadas
    const ventasData = todasLasFechas.map(date => {
      const total = ventas.filter(v => v.fecha.toDate().getTime() === date)
        .reduce((sum, curr) => sum + curr.totalVenta, 0);
      return total;
    });

    const gastosData = todasLasFechas.map(date => {
      const total = gastos.filter(g => g.fecha.toDate().getTime() === date)
        .reduce((sum, curr) => sum + curr.total, 0);
      return total;
    });

    const chartData = {
      labels: fechasFormato,
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
              labelColor: function (context) {
                return {
                  borderColor: 'rgba(0, 0, 0, 0)',
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  borderWidth: 2,
                  borderDash: [2, 2],
                  borderRadius: 2,
                };
              },
              labelTextColor: function () {
                return 'rgba(255, 255, 255, 0.8)';
              }
            }
          }
        }
      }
    };

    const canvas = document.getElementById('lineChart') as HTMLCanvasElement;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        if (this.lineChart) {
          this.lineChart.destroy();
        }
        this.lineChart = new Chart(context, config);
      } else {
        console.error("No se pudo obtener el contexto del canvas para el gráfico de líneas.");
      }
    } else {
      console.error("Elemento canvas para el gráfico de líneas no encontrado.");
    }
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
    } else if (intervalo === 'por_tipo') {
      return this.agruparVentasPorTipo(ventas);
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

  agruparVentasPorTipo(ventas: any[]): any[] {
    console.log("Ventas originales:", ventas);  // Debugging: Ver las ventas originales
    const agrupados = ventas.reduce((acum, venta) => {
      venta.detalle.forEach((item: any) => {
        const tipoNormalizado = item.tipo.trim().toLowerCase(); // Normaliza el tipo para evitar duplicados por errores de formato
        if (!acum[tipoNormalizado]) {
          acum[tipoNormalizado] = { tipo: item.tipo, cantidad: 0 };
        }
        // Asegúrate de que la cantidad es un número y suma correctamente
        const cantidad = Number(item.cantidad);
        if (!isNaN(cantidad)) {
          acum[tipoNormalizado].cantidad += cantidad;
        } else {
          console.error("Cantidad no es un número:", item);
        }
      });
      return acum;
    }, {});
    console.log("Ventas agrupadas por tipo:", agrupados);  // Debugging: Ver las ventas agrupadas
    return Object.values(agrupados);
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

  mostrarSeccion(seccion: string) {
    this.mostrarVentas = seccion === 'ventas';
    this.mostrarGastos = seccion === 'gastos';
    this.mostrarGraficas = seccion === 'graficas';

    // Si se selecciona "graficas", cargar los gráficos con un pequeño retraso para asegurar que el DOM esté listo
    if (this.mostrarGraficas) {
      setTimeout(() => {
        this.loadDataAndRenderChart();
        this.loadGastoDataAndRenderChart();
        this.loadLineChartDataAndRenderChart();
      }, 100);
    }
  }

}
