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
