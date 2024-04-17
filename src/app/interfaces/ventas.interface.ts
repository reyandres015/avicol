import DetalleVenta from "./detalleVenta.interface"

export default interface Ventas{
  fecha: string
  cliente: string
  detalle: DetalleVenta
  totalVenta: number
}
