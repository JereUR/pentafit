import { daysOfWeek, type SelectOption } from "@/lib/utils"
import { PaymentType, PlanType } from "@prisma/client"
import type { UserClient } from "@/types/user"

export const columnsPlans: { key: keyof PlanData; label: string }[] = [
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripción" },
  { key: "price", label: "Precio" },
  { key: "startDate", label: "Fecha de inicio" },
  { key: "endDate", label: "Fecha de fin" },
  { key: "expirationPeriod", label: "Plazo de vencimiento" },
  { key: "generateInvoice", label: "¿Permite generación de factura?" },
  { key: "paymentTypes", label: "Modalidad de cobro" },
  { key: "planType", label: "Tipo" },
  { key: "freeTest", label: "Ofrece clase de prueba" },
  { key: "current", label: "Vigente" },
  { key: "diaryPlans", label: "Actividades asociadas" },
  { key: "assignedUsersCount", label: "Usuarios asignados" },
]

export interface DiaryPlanData {
  id: string
  name: string
  daysOfWeek: boolean[]
  sessionsPerWeek: number
  activityId: string
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
  diaryPlans: DiaryPlanData[]
  assignedUsersCount?: number
  assignedUsers?: UserClient[]
}

export interface DiaryPlansValues {
  id?: string
  name: string
  daysOfWeek: boolean[]
  sessionsPerWeek: number
  vacancies: number
  activityId: string
}

export interface PlanDataExport {
  name: string
  description: string
  price: number
  startDate: string
  endDate: string
  expirationPeriod: number
  generateInvoice: string
  paymentTypes: string
  planType: string
  freeTest: string
  current: string
  diaryPlans: string
  assignedUsersCount: string
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

export const formatDiaryPlans = (
  diaryPlans: {
    id: string
    name: string
    daysOfWeek: boolean[]
    sessionsPerWeek: number
    planId: string
    activityId: string
  }[],
): string => {
  return diaryPlans
    .map((plan) => {
      const days = plan.daysOfWeek
        .map((active, index) => (active ? daysOfWeek[index] : null))
        .filter(Boolean)
        .join(", ")

      return `${plan.name} - ${plan.sessionsPerWeek === 1 ? "1 sesión máxima" : `${plan.sessionsPerWeek} sesiones máximas`} por semana  (${days})`
    })
    .join("\n")
}
