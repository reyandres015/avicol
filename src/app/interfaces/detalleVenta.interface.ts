export default interface DetalleVenta {
  tipo: 'C' | 'B' | 'A' | 'AA' | 'EX' | 'JUM' | 'OTRO'
  cantidad: number
  valorUnitario: number
  total: number
}
