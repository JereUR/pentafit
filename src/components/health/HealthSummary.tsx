import { AlertCircle, Pill, AlertTriangle } from "lucide-react"
import { LigatureIcon as Bandage } from "lucide-react"

import type { UserHealthInfo, ChronicCondition, Medication, Injury, Allergy } from "@/types/health"

interface HealthSummaryProps {
  healthInfo: UserHealthInfo
}

export function HealthSummary({ healthInfo }: HealthSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex flex-col items-center p-3 rounded-lg border bg-background">
          <AlertCircle
            className={`h-6 w-6 mb-2 ${healthInfo.hasChronicConditions ? "text-red-500" : "text-muted-foreground"}`}
          />
          <div className="text-sm font-medium">Condiciones Crónicas</div>
          <div className="text-xs text-muted-foreground">
            {healthInfo.hasChronicConditions
              ? `${(healthInfo.chronicConditions as ChronicCondition[])?.length || 0} reportadas`
              : "Ninguna"}
          </div>
        </div>

        <div className="flex flex-col items-center p-3 rounded-lg border bg-background">
          <Pill className={`h-6 w-6 mb-2 ${healthInfo.takingMedication ? "text-blue-500" : "text-muted-foreground"}`} />
          <div className="text-sm font-medium">Medicamentos</div>
          <div className="text-xs text-muted-foreground">
            {healthInfo.takingMedication
              ? `${(healthInfo.medications as Medication[])?.length || 0} activos`
              : "Ninguno"}
          </div>
        </div>

        <div className="flex flex-col items-center p-3 rounded-lg border bg-background">
          <Bandage className={`h-6 w-6 mb-2 ${healthInfo.hasInjuries ? "text-orange-500" : "text-muted-foreground"}`} />
          <div className="text-sm font-medium">Lesiones</div>
          <div className="text-xs text-muted-foreground">
            {healthInfo.hasInjuries ? `${(healthInfo.injuries as Injury[])?.length || 0} reportadas` : "Ninguna"}
          </div>
        </div>

        <div className="flex flex-col items-center p-3 rounded-lg border bg-background">
          <AlertTriangle
            className={`h-6 w-6 mb-2 ${healthInfo.hasAllergies ? "text-yellow-500" : "text-muted-foreground"}`}
          />
          <div className="text-sm font-medium">Alergias</div>
          <div className="text-xs text-muted-foreground">
            {healthInfo.hasAllergies ? `${(healthInfo.allergies as Allergy[])?.length || 0} reportadas` : "Ninguna"}
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
    <div className="mt-6 p-4 border rounded-lg">
      <h3 className="font-medium mb-2">Contacto de Emergencia</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
        <div>
          <span className="font-medium">Nombre:</span> {healthInfo.emergencyContactName}
        </div>
        <div>
          <span className="font-medium">Teléfono:</span> {healthInfo.emergencyContactPhone}
        </div>
        <div>
          <span className="font-medium">Relación:</span> {healthInfo.emergencyContactRelation}
        </div>
      </div>
    </div>
  )
}

function MedicalNotes({ notes }: { notes: string }) {
  return (
    <div className="mt-4 p-4 bg-muted/30 rounded-lg">
      <h4 className="font-semibold mb-2">Notas Médicas</h4>
      <p className="text-muted-foreground">{notes}</p>
    </div>
  )
}
