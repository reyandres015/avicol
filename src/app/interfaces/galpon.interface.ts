import { DocumentReference } from "@angular/fire/firestore"
import Gastos from "./gastos.interface"
import Ventas from "./ventas.interface"
import inventario from "./inventario.interface"

export default interface Galpon {
  name: string
  ref: string
  ventasTotales?: number
  gastosTotales?: number
  ventas?: Ventas[]
  gastos?: Gastos[]
  inventario?: inventario[]
}
