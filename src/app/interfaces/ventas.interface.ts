import { Timestamp } from "@angular/fire/firestore"
import DetalleVenta from "./detalleVenta.interface"

export default interface Ventas{
  fecha: Timestamp
  cliente: string
  detalle: DetalleVenta[]
  totalVenta: number
}
