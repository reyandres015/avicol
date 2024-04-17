import Gastos from "./gastos.interface"
import Ventas from "./ventas.interface"

export default interface Galpon {
  name: string
  ventas?: Ventas[]
  gastos?: Gastos[]
}
