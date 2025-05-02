import { AlertCircle, Pill, AlertTriangle } from "lucide-react"
import { LigatureIcon as Bandage } from "lucide-react"

import type { UserHealthInfo, ChronicCondition, Medication, Injury, Allergy } from "@/types/health"

interface HealthSummaryProps {
  healthInfo: UserHealthInfo
}

export function HealthSummary({ healthInfo }: HealthSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-4 mb-4">
        <div className="flex flex-col items-center p-2 sm:p-3 rounded-lg border bg-background">
          <AlertCircle
            className={`h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2 ${
              healthInfo.hasChronicConditions ? "text-red-500" : "text-muted-foreground"
            }`}
          />
          <div className="text-xs sm:text-sm font-medium text-center">Condiciones</div>
          <div className="text-xs text-muted-foreground">
            {healthInfo.hasChronicConditions
              ? `${(healthInfo.chronicConditions as ChronicCondition[])?.length || 0}`
              : "Ninguna"}
          </div>
        </div>

        <div className="flex flex-col items-center p-2 sm:p-3 rounded-lg border bg-background">
          <Pill
            className={`h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2 ${
              healthInfo.takingMedication ? "text-blue-500" : "text-muted-foreground"
            }`}
          />
          <div className="text-xs sm:text-sm font-medium text-center">Medicamentos</div>
          <div className="text-xs text-muted-foreground">
            {healthInfo.takingMedication ? `${(healthInfo.medications as Medication[])?.length || 0}` : "Ninguno"}
          </div>
        </div>

        <div className="flex flex-col items-center p-2 sm:p-3 rounded-lg border bg-background">
          <Bandage
            className={`h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2 ${
              healthInfo.hasInjuries ? "text-orange-500" : "text-muted-foreground"
            }`}
          />
          <div className="text-xs sm:text-sm font-medium text-center">Lesiones</div>
          <div className="text-xs text-muted-foreground">
            {healthInfo.hasInjuries ? `${(healthInfo.injuries as Injury[])?.length || 0}` : "Ninguna"}
          </div>
        </div>

        <div className="flex flex-col items-center p-2 sm:p-3 rounded-lg border bg-background">
          <AlertTriangle
            className={`h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2 ${
              healthInfo.hasAllergies ? "text-yellow-500" : "text-muted-foreground"
            }`}
          />
          <div className="text-xs sm:text-sm font-medium text-center">Alergias</div>
          <div className="text-xs text-muted-foreground">
            {healthInfo.hasAllergies ? `${(healthInfo.allergies as Allergy[])?.length || 0}` : "Ninguna"}
          </div>
        </div>
      </div>

      {healthInfo.emergencyContactName && <EmergencyContactInfo healthInfo={healthInfo} />}
      {healthInfo.medicalNotes && <MedicalNotes notes={healthInfo.medicalNotes} />}
    </div>
  )
}

function EmergencyContactInfo({ healthInfo }: { healthInfo: UserHealthInfo }) {
  return (
    <div className="mt-4 sm:mt-6 p-3 sm:p-4 border rounded-lg">
      <h3 className="font-medium mb-2 text-sm sm:text-base">Contacto de Emergencia</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
        <div className="break-words">
          <span className="font-medium">Nombre:</span> {healthInfo.emergencyContactName}
        </div>
        <div className="break-words">
          <span className="font-medium">Teléfono:</span> {healthInfo.emergencyContactPhone}
        </div>
        <div className="break-words">
          <span className="font-medium">Relación:</span> {healthInfo.emergencyContactRelation}
        </div>
      </div>
    </div>
  )
}

function MedicalNotes({ notes }: { notes: string }) {
  return (
    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-muted/30 rounded-lg">
      <h4 className="font-semibold mb-2 text-sm sm:text-base">Notas Médicas</h4>
      <p className="text-muted-foreground text-xs sm:text-sm">{notes}</p>
    </div>
  )
}