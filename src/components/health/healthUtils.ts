export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "MILD":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "MODERATE":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "SEVERE":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export const getSeverityLabel = (severity: string) => {
  switch (severity) {
    case "MILD":
      return "Leve"
    case "MODERATE":
      return "Moderada"
    case "SEVERE":
      return "Severa"
    default:
      return severity
  }
}

import type { UserClient } from "@/types/user"
import type { StaffMember } from "@/types/activity"

export type SelectableUser = UserClient | StaffMember

export function isUserClient(user: SelectableUser): user is UserClient {
  return "hasChronicConditions" in user
}

export const hasHealthConditions = (user: SelectableUser, showHealthWarnings = true) => {
  if (!isUserClient(user) || !showHealthWarnings) return false

  return (
    (user.hasChronicConditions && user.chronicConditions && user.chronicConditions.length > 0) ||
    (user.takingMedication && user.medications && user.medications.length > 0) ||
    (user.hasInjuries && user.injuries && user.injuries.length > 0) ||
    (user.hasAllergies && user.allergies && user.allergies.length > 0)
  )
}
