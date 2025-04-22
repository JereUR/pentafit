import { AlertCircle, AlertTriangle, Pill } from "lucide-react"
import { LigatureIcon as Bandage } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { UserClient } from "@/types/user"
import { getSeverityColor, getSeverityLabel } from "./healthUtils"
import { Allergy, ChronicCondition, Injury, Medication } from "@/types/health"

interface HealthTooltipContentProps {
  user: UserClient
}

export function HealthTooltipContent({ user }: HealthTooltipContentProps) {
  return (
    <div className="p-3">
      <div className="font-medium text-sm mb-2 border-b pb-1">Condiciones Médicas</div>

      {user.hasChronicConditions && user.chronicConditions && user.chronicConditions.length > 0 && (
        <ChronicConditionsSection conditions={user.chronicConditions} />
      )}

      {user.takingMedication && user.medications && user.medications.length > 0 && (
        <MedicationsSection medications={user.medications} />
      )}

      {user.hasInjuries && user.injuries && user.injuries.length > 0 && <InjuriesSection injuries={user.injuries} />}

      {user.hasAllergies && user.allergies && user.allergies.length > 0 && (
        <AllergiesSection allergies={user.allergies} />
      )}
    </div>
  )
}

function ChronicConditionsSection({ conditions }: { conditions: ChronicCondition[] }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-1 text-xs font-medium mb-1">
        <AlertCircle className="h-3.5 w-3.5 text-red-500" />
        <span>Condiciones Crónicas:</span>
      </div>
      <div className="pl-5 space-y-1">
        {conditions.map((condition, idx) => (
          <div key={idx} className="text-xs flex items-center justify-between">
            <span>{condition.name}</span>
            <Badge className={`text-[10px] py-0 px-1.5 ${getSeverityColor(condition.severity)}`}>
              {getSeverityLabel(condition.severity)}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}

function MedicationsSection({ medications }: { medications: Medication[] }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-1 text-xs font-medium mb-1">
        <Pill className="h-3.5 w-3.5 text-blue-500" />
        <span>Medicamentos:</span>
      </div>
      <div className="pl-5 space-y-1">
        {medications.map((med, idx) => (
          <div key={idx} className="text-xs">
            <span>{med.name}</span>
            {med.dosage && <span className="text-muted-foreground"> ({med.dosage})</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function InjuriesSection({ injuries }: { injuries: Injury[] }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-1 text-xs font-medium mb-1">
        <Bandage className="h-3.5 w-3.5 text-orange-500" />
        <span>Lesiones:</span>
      </div>
      <div className="pl-5 space-y-1">
        {injuries
          .filter((injury) => injury.affectsExercise)
          .map((injury, idx) => (
            <div key={idx} className="text-xs">
              <div className="flex items-center justify-between">
                <span>
                  {injury.name} ({injury.bodyPart})
                </span>
                <Badge className={`text-[10px] py-0 px-1.5 ${getSeverityColor(injury.severity)}`}>
                  {getSeverityLabel(injury.severity)}
                </Badge>
              </div>
              {injury.exerciseRestrictions && (
                <div className="text-[10px] text-muted-foreground mt-0.5">{injury.exerciseRestrictions}</div>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}

function AllergiesSection({ allergies }: { allergies: Allergy[] }) {
  return (
    <div className="mb-1">
      <div className="flex items-center gap-1 text-xs font-medium mb-1">
        <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
        <span>Alergias:</span>
      </div>
      <div className="pl-5 space-y-1">
        {allergies.map((allergy, idx) => (
          <div key={idx} className="text-xs flex items-center justify-between">
            <span>{allergy.allergen}</span>
            <Badge className={`text-[10px] py-0 px-1.5 ${getSeverityColor(allergy.severity)}`}>
              {getSeverityLabel(allergy.severity)}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
