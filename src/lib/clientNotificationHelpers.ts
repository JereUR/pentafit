import { type Prisma, type NotificationType, Role } from "@prisma/client"
import { formatDate } from "./utils"

type ClientNotificationDetails = {
  recipientId: string
  issuerId: string
  facilityId: string
  type: NotificationType
  relatedId?: string
  entityName?: string
  startDate?: Date
  endDate?: Date
  changeDetails?: string[]
  replacedEntityName?: string
}

export async function createClientNotification({
  tx,
  ...details
}: ClientNotificationDetails & {
  tx: Prisma.TransactionClient
}) {
  const recipient = await tx.user.findUnique({
    where: { id: details.recipientId },
    select: {
      firstName: true,
      lastName: true,
      role: true,
    },
  })

  if (!recipient || recipient.role !== Role.CLIENT) return

  const issuer = await tx.user.findUnique({
    where: { id: details.issuerId },
    select: {
      firstName: true,
      lastName: true,
    },
  })

  const issuerName = issuer
    ? `${issuer.firstName} ${issuer.lastName}`
    : "Un miembro del staff"

  const message = generatePersonalizedMessage(details, recipient, issuerName)

  await tx.notification.create({
    data: {
      recipientId: details.recipientId,
      issuerId: details.issuerId,
      facilityId: details.facilityId,
      type: details.type,
      message,
      read: false,
      ...(details.relatedId && {
        [getRelatedIdField(details.type)]: details.relatedId,
      }),
    },
  })
}

function getRelatedIdField(type: NotificationType): string {
  if (type.toLowerCase().includes("activity")) return "activityId"
  if (
    type.toLowerCase().includes("plan") &&
    !type.toLowerCase().includes("nutritional")
  )
    return "planId"
  if (type.toLowerCase().includes("diary")) return "diaryId"
  if (
    type.toLowerCase().startsWith("routine") ||
    type.toLowerCase().startsWith("assign_routine") ||
    type.toLowerCase().startsWith("unassign_routine")
  )
    return "routineId"
  if (type.toLowerCase().startsWith("preset_routine")) return "presetRoutineId"
  if (
    type.toLowerCase().startsWith("nutritional_plan") ||
    type.toLowerCase().startsWith("assign_nutritional_plan") ||
    type.toLowerCase().startsWith("unassign_nutritional_plan")
  )
    return "nutritionalPlanId"
  if (type.toLowerCase().startsWith("preset_nutritional_plan"))
    return "presetNutritionalPlanId"
  if(type.toLowerCase().startsWith("invoice")) return "invoiceId"
  if (type.toLowerCase().startsWith("payment")) return "paymentId"
  return "userId"
}

function generatePersonalizedMessage(
  details: ClientNotificationDetails,
  recipient: { firstName: string; lastName: string },
  issuerName: string,
): string {
  const {
    type,
    entityName = "elemento",
    startDate,
    endDate,
    changeDetails = [],
    replacedEntityName,
  } = details

  const greeting = `Hola ${recipient.firstName},`

  const formattedStartDate = startDate ? formatDate(startDate) : ""
  const formattedEndDate = endDate ? formatDate(endDate) : ""

  switch (type) {
    // Plan notifications
    case "ASSIGN_PLAN_USER":
      return `${greeting} ${issuerName} te ha asignado el plan "${entityName}"${formattedStartDate ? ` a partir del ${formattedStartDate}` : ""}.${replacedEntityName ? ` Este plan reemplaza tu plan anterior "${replacedEntityName}".` : ""} Puedes ver los detalles en la sección de planes.`

    case "UNASSIGN_PLAN_USER":
      return `${greeting} ${issuerName} ha desasignado tu plan "${entityName}"${formattedEndDate ? ` a partir del ${formattedEndDate}` : ""}.`

    case "PLAN_UPDATED":
      if (changeDetails.length > 0) {
        return `${greeting} ${issuerName} ha actualizado tu plan "${entityName}". Cambios: ${changeDetails.join(", ")}.`
      }
      return `${greeting} ${issuerName} ha actualizado tu plan "${entityName}". Revisa los detalles en la sección de planes.`

    case "DIARY_PLAN_UPDATED":
      return `${greeting} ${issuerName} ha realizado cambios en las agendas de tu plan "${entityName}". Por favor revisa tus horarios en la sección de agendas.`

    // Routine notifications
    case "ASSIGN_ROUTINE_USER":
      return `${greeting} ${issuerName} te ha asignado una nueva rutina: "${entityName}".${replacedEntityName ? ` Esta rutina reemplaza tu rutina anterior "${replacedEntityName}".` : ""} Puedes verla en la sección de entrenamiento.`

    case "UNASSIGN_ROUTINE_USER":
      return `${greeting} ${issuerName} ha desasignado tu rutina "${entityName}".`

    case "ROUTINE_UPDATED":
      return `${greeting} ${issuerName} ha actualizado tu rutina "${entityName}". Revisa los cambios en la sección de entrenamiento.`

    // Nutritional plan notifications
    case "ASSIGN_NUTRITIONAL_PLAN_USER":
      return `${greeting} ${issuerName} te ha asignado un nuevo plan nutricional: "${entityName}".${replacedEntityName ? ` Este plan reemplaza tu plan nutricional anterior "${replacedEntityName}".` : ""} Puedes verlo en la sección de nutrición.`

    case "UNASSIGN_NUTRITIONAL_PLAN_USER":
      return `${greeting} ${issuerName} ha desasignado tu plan nutricional "${entityName}".`

    case "NUTRITIONAL_PLAN_UPDATED":
      return `${greeting} ${issuerName} ha actualizado tu plan nutricional "${entityName}". Revisa los cambios en la sección de nutrición.`

    // Activity notifications
    case "ACTIVITY_UPDATED":
      return `${greeting} ${issuerName} ha realizado cambios en la actividad "${entityName}" a la que estás inscrito. Por favor revisa los detalles en la sección de actividades.`

    // Invoice notifications
case "INVOICE_CREATED":
  return `${greeting} ${issuerName} ha generado una nueva factura "${entityName}"${formattedStartDate ? ` con fecha de emisión ${formattedStartDate}` : ""}. Revisa los detalles en la sección de facturación.`

case "INVOICE_UPDATED":
  if (changeDetails.length > 0) {
    return `${greeting} ${issuerName} ha actualizado la factura "${entityName}". Cambios: ${changeDetails.join(", ")}. Revisa los detalles en la sección de facturación.`
  }
  return `${greeting} ${issuerName} ha actualizado la factura "${entityName}". Revisa los detalles en la sección de facturación.`

case "INVOICE_DELETED":
  return `${greeting} ${issuerName} ha eliminado la factura "${entityName}"${formattedEndDate ? ` el ${formattedEndDate}` : ""}.`

// Payment notifications
case "PAYMENT_CREATED":
  return `${greeting} ${issuerName} ha registrado un nuevo pago "${entityName}"${formattedStartDate ? ` con fecha ${formattedStartDate}` : ""}. Revisa los detalles en la sección de facturación.`

case "PAYMENT_UPDATED":
  if (changeDetails.length > 0) {
    return `${greeting} ${issuerName} ha actualizado el pago "${entityName}". Cambios: ${changeDetails.join(", ")}. Revisa los detalles en la sección de facturación.`
  }
  return `${greeting} ${issuerName} ha actualizado el pago "${entityName}". Revisa los detalles en la sección de facturación.`

case "PAYMENT_DELETED":
  return `${greeting} ${issuerName} ha eliminado el pago "${entityName}"${formattedEndDate ? ` el ${formattedEndDate}` : ""}.`


    // Default message for other notification types
    default:
      return `${greeting} ${issuerName} ha realizado una actualización en tu cuenta relacionada con "${entityName}". Por favor revisa los detalles en tu perfil.`
  }
}
