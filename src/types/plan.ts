export enum PlanType {
  MENSUAL = "MENSUAL",
  CLASE_UNICA = "CLASE_UNICA",
  MEMBRESIA = "MEMBRESIA",
}

export enum PaymentType {
  EFECTIVO = "EFECTIVO",
  TRANSFERENCIA = "TRANSFERENCIA",
  DEBITO_AUTOMATICO = "DEBITO_AUTOMATICO",
}

export interface DiaryPlanData {
  id: string
  name: string
  daysOfWeek: boolean[]
  sessionsPerWeek: number
  activityId: string
  activityName: string
}

export interface PlanData {
  id: string
  name: string
  description: string
  price: number
  startDate: Date
  endDate: Date
  expirationPeriod: number
  generateInvoice: boolean
  paymentTypes: PaymentType[]
  planType: PlanType
  freeTest: boolean
  current: boolean
  diariesCount: number
  facilities: {
    id: string
    name: string
    logoUrl?: string
  }[]
  diaryPlans: DiaryPlanData[]
}

export interface SelectOption {
  key: string
  value: string
}

export const planTypeOptions: SelectOption[] = [
  { key: PlanType.MENSUAL, value: "Mensual" },
  { key: PlanType.CLASE_UNICA, value: "Clase única" },
  { key: PlanType.MEMBRESIA, value: "Membresía" },
]

export const paymentTypeOptions: SelectOption[] = [
  { key: PaymentType.EFECTIVO, value: "Efectivo" },
  { key: PaymentType.TRANSFERENCIA, value: "Transferencia" },
  { key: PaymentType.DEBITO_AUTOMATICO, value: "Débito automático" },
]
