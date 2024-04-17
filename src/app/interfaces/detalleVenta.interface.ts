export default interface DetalleVenta {
  tipo: 'c' | 'b' | 'a' | 'aa' | 'ex' | 'jum' | 'otro'
  valorUnitario: number
  total: number
}
