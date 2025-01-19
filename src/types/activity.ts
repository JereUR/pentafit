export const columns: { key: keyof ActivityData; label: string }[] = [
  { key: 'name', label: 'Nombre' },
  { key: 'description', label: 'Descripción' },
  { key: 'price', label: 'Precio' },
  { key: 'isPublic', label: 'Es público' },
  { key: 'publicName', label: 'Nombre público' },
  { key: 'generateInvoice', label: 'Generar factura' },
  { key: 'maxSessions', label: 'Sesiones máximas' },
  { key: 'mpAvailable', label: 'Disponible en MP' },
  { key: 'startDate', label: 'Fecha de inicio' },
  { key: 'endDate', label: 'Fecha de fin' },
  { key: 'paymentType', label: 'Tipo de pago' },
  { key: 'activityType', label: 'Tipo de actividad' },
]

export type ActivityData = {
  id: string
  name: string
  description: string | null
  price: number
  isPublic: boolean
  publicName: string | null
  generateInvoice: boolean
  maxSessions: number
  mpAvailable: boolean
  startDate: Date
  endDate: Date
  paymentType: string
  activityType: string
}
