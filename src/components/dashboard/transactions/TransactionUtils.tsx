import { format, formatDistanceToNow, isWithinInterval, subDays } from "date-fns"
import { es } from "date-fns/locale"

import { type Transaction, TransactionType } from "@/types/transactions"

export function getTransactionType(type: TransactionType): string {
  if (type.includes("ACTIVITY")) return "Actividad"
  if (type.includes("STAFF")) return "Staff"
  if (type.includes("CLIENT")) return "Cliente"
  if (type.startsWith("PLAN")) return "Plan"
  if (type.includes("DIARY")) return "Diario"
  if (type === TransactionType.ASSIGN_ROUTINE_USER) return "Asignación de Rutina"
  if (type === TransactionType.UNASSIGN_ROUTINE_USER) return "Desasignación de Rutina"
  if (type === TransactionType.ROUTINE_CONVERTED_TO_PRESET) return "Conversión a Preestablecida"
  if (type.startsWith("ROUTINE")) return "Rutina"
  if (type.startsWith("PRESET_ROUTINE")) return "Rutina preestablecida"
  if (type === TransactionType.ASSIGN_NUTRITIONAL_PLAN_USER) return "Asignación de Plan Nutricional"
  if (type === TransactionType.UNASSIGN_NUTRITIONAL_PLAN_USER) return "Desasignación de Plan Nutricional"
  if (type === TransactionType.NUTRITIONAL_PLAN_CONVERTED_TO_PRESET) return "Conversión a Plan Preestablecido"
  if (type.includes("NUTRITIONAL_PLAN") && !type.includes("PRESET")) return "Plan Nutricional"
  if (type.includes("PRESET_NUTRITIONAL_PLAN")) return "Plan Nutricional preestablecido"
  return "N/A"
}

export function getTransactionName(transaction: Transaction): string {
  if (transaction.targetUser) {
    return `${transaction.targetUser.firstName} ${transaction.targetUser.lastName}`
  }
  if (transaction.activity) return transaction.activity.name
  if (transaction.plan) return transaction.plan.name
  if (transaction.diary) return transaction.diary.name
  if (transaction.routine) return transaction.routine.name
  if (transaction.presetRoutine) return transaction.presetRoutine.name
  if (transaction.nutritionalPlan) return transaction.nutritionalPlan.name
  if (transaction.presetNutritionalPlan) return transaction.presetNutritionalPlan.name

  if (transaction.details) {
    return transaction.details.attachmentName || transaction.details.replicatedName || "N/A"
  }

  return "N/A"
}

export function isUserTransaction(type: TransactionType): boolean {
  return type.includes("STAFF") || type.includes("CLIENT")
}

export function isReplicationTransaction(type: TransactionType): boolean {
  return type.includes("REPLICATED")
}

export function getFormattedDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const isRecent = isWithinInterval(date, {
    start: subDays(now, 1),
    end: now,
  })

  if (isRecent) {
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: es,
    })
  }

  return format(date, "dd.MM.yyyy HH:mm", { locale: es })
}

export function getReplicationInfo(transaction: Transaction) {
  if (!transaction.details || !isReplicationTransaction(transaction.type)) return null

  if (transaction.details.targetFacilities && Array.isArray(transaction.details.targetFacilities)) {
    return {
      count: transaction.details.targetFacilities.length,
      facilities: transaction.details.targetFacilities.map((facility) => ({
        id: facility.id,
        name: facility.name || facility.id,
        logoUrl: facility.logoUrl,
      })),
    }
  }

  if (transaction.details.targetFacilityId) {
    const facilityName = transaction.details.replicatedName || transaction.details.targetFacilityId

    return {
      count: 1,
      facilities: [
        {
          id: transaction.details.targetFacilityId,
          name: facilityName,
          logoUrl: undefined,
        },
      ],
    }
  }

  return null
}

export function getAssignmentInfo(transaction: Transaction) {
  if (
    (transaction.type !== TransactionType.ASSIGN_ROUTINE_USER &&
      transaction.type !== TransactionType.ASSIGN_NUTRITIONAL_PLAN_USER) ||
    !transaction.details
  ) {
    return null
  }

  if (typeof transaction.details === "string") {
    try {
      const parsedDetails = JSON.parse(transaction.details)
      return {
        assignedCount: parsedDetails.assignedCount || 0,
        alreadyAssignedCount: parsedDetails.alreadyAssignedCount || 0,
        assignedUsers: parsedDetails.assignedUsers || [],
      }
    } catch (e) {
      console.error("Error parsing transaction details:", e)
      return null
    }
  }

  return {
    assignedCount: transaction.details.assignedCount || 0,
    alreadyAssignedCount: transaction.details.alreadyAssignedCount || 0,
    assignedUsers: transaction.details.assignedUsers || [],
  }
}

export function getUnassignmentInfo(transaction: Transaction) {
  if (
    (transaction.type !== TransactionType.UNASSIGN_ROUTINE_USER &&
      transaction.type !== TransactionType.UNASSIGN_NUTRITIONAL_PLAN_USER) ||
    !transaction.details
  ) {
    return null
  }

  if (typeof transaction.details === "string") {
    try {
      const parsedDetails = JSON.parse(transaction.details)
      return {
        unassignedCount: parsedDetails.unassignedCount || 0,
        unassignedUsers: parsedDetails.unassignedUsers || [],
      }
    } catch (e) {
      console.error("Error parsing transaction details:", e)
      return null
    }
  }

  return {
    unassignedCount: transaction.details.unassignedCount || 0,
    unassignedUsers: transaction.details.unassignedUsers || [],
  }
}

export function getConversionInfo(transaction: Transaction) {
  if (
    (transaction.type !== TransactionType.ROUTINE_CONVERTED_TO_PRESET &&
      transaction.type !== TransactionType.NUTRITIONAL_PLAN_CONVERTED_TO_PRESET) ||
    !transaction.details
  ) {
    return null
  }

  if (typeof transaction.details === "string") {
    try {
      const parsedDetails = JSON.parse(transaction.details)
      if (transaction.type === TransactionType.ROUTINE_CONVERTED_TO_PRESET) {
        return {
          presetId: parsedDetails.presetRoutineId || "",
          presetName: parsedDetails.presetRoutineName || "",
        }
      } else {
        return {
          presetId: parsedDetails.presetNutritionalPlanId || "",
          presetName: parsedDetails.presetNutritionalPlanName || "",
        }
      }
    } catch (e) {
      console.error("Error parsing transaction details:", e)
      return null
    }
  }

  if (transaction.type === TransactionType.ROUTINE_CONVERTED_TO_PRESET) {
    return {
      presetId: transaction.details.presetRoutineId || "",
      presetName: transaction.details.presetRoutineName || "",
    }
  } else {
    return {
      presetId: transaction.details.presetNutritionalPlanId || "",
      presetName: transaction.details.presetNutritionalPlanName || "",
    }
  }
}

