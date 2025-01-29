import { PaymentType, PlanType } from "@prisma/client"

export const columnsPlans: { key: keyof PlanData; label: string }[] = [
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripción" },
  { key: "price", label: "Precio" },
  { key: "startDate", label: "Fecha de inicio" },
  { key: "endDate", label: "Fecha de fin" },
  { key: "expirationPeriod", label: "Plazo de vencimiento" },
  { key: "generateInvoice", label: "¿Permite generación de cuota?" },
  { key: "paymentTypes", label: "Modalidad de cobro" },
  { key: "planType", label: "Tipo" },
  { key: "freeTest", label: "Ofrece clase de prueba" },
  { key: "current", label: "Vigente" },
  { key: "diaryPlans", label: "Actividades asociadas" },
]

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
  facilityId: string
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
