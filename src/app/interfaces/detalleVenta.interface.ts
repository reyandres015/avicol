export default interface DetalleVenta {
  tipo: 'c' | 'b' | 'a' | 'aa' | 'ex' | 'jum' | 'otro'
  cantidad: number
  valorUnitario: number
  total: number
}
