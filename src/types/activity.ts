export const columnsActivities: { key: keyof ActivityData; label: string }[] = [
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripción" },
  { key: "price", label: "Precio" },
  { key: "isPublic", label: "Es público" },
  { key: "publicName", label: "Nombre público" },
  { key: "generateInvoice", label: "Generar factura" },
  { key: "maxSessions", label: "Sesiones máximas" },
  { key: "mpAvailable", label: "Disponible en MP" },
  { key: "startDate", label: "Fecha de inicio" },
  { key: "endDate", label: "Fecha de fin" },
  { key: "paymentType", label: "Tipo de pago" },
  { key: "activityType", label: "Tipo de actividad" },
  { key: "staffMembers", label: "Staff asignado" },
]

export const paymentsType = [
  "Por sesión",
  "Por período",
  "Mensual",
  "Mensual con sesiones",
]

export const activitiesType = ["Individual", "Grupal"]

export type StaffMember = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  avatarUrl: string | null
}

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
  facilityId: string
  staffMembers?: StaffMember[]
  staffIds?: string[]
}

export type ActivityExportData = {
  name: string
  description: string
  price: number
  isPublic: string
  publicName: string
  generateInvoice: string
  maxSessions: number
  mpAvailable: string
  startDate: string
  endDate: string
  paymentType: string
  activityType: string
  staffMembers: string
}

export function formatStaffMembersForExport(
  staffMembers: StaffMember[] | undefined,
): string {
  if (!staffMembers || staffMembers.length === 0) {
    return "Sin personal asignado"
  }

  return staffMembers
    .map((staff) => {
      const name = `${staff.firstName} ${staff.lastName}`
      const email = staff.email ? ` (${staff.email})` : ""
      return `• ${name}${email}`
    })
    .join("\n")
}
