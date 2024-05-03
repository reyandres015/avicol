import { Timestamp } from "@angular/fire/firestore";

export default interface inventario {
    fecha: Timestamp
    detalle: []
    TotalInventario: number
}