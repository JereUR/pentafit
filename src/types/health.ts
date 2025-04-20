export interface Medication {
  name: string
  dosage: string
  frequency: string
  purpose?: string
}

export interface ChronicCondition {
  name: string
  diagnosisDate?: string
  severity: "MILD" | "MODERATE" | "SEVERE"
  notes?: string
}

export interface Injury {
  name: string
  bodyPart: string
  dateOccurred?: string
  affectsExercise: boolean
  exerciseRestrictions?: string
  severity: "MILD" | "MODERATE" | "SEVERE"
}

export interface Allergy {
  allergen: string
  reaction: string
  severity: "MILD" | "MODERATE" | "SEVERE"
}

export interface EmergencyContact {
  name: string
  phone: string
  relation: string
}

export interface UserHealthInfo {
  id: string
  hasChronicConditions: boolean
  chronicConditions?: ChronicCondition[]
  takingMedication: boolean
  medications?: Medication[]
  hasInjuries: boolean
  injuries?: Injury[]
  hasAllergies: boolean
  allergies?: Allergy[]
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelation?: string
  medicalNotes?: string
}

export const severityOptions = [
  { value: "MILD", label: "Leve" },
  { value: "MODERATE", label: "Moderada" },
  { value: "SEVERE", label: "Severa" },
]
