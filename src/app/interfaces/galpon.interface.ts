import { DocumentReference } from "@angular/fire/firestore"
import Gastos from "./gastos.interface"
import Ventas from "./ventas.interface"

export default interface Galpon {
  name: string
  ref: string
  totalVentas?: number
  totalGastos?: number
  ventas?: Ventas[]
  gastos?: Gastos[]
}
