import { Badge } from "@/components/ui/badge"
import type { Allergy } from "@/types/health"
import { getSeverityColor, getSeverityLabel } from "./healthUtils"

interface AllergiesTabProps {
  allergies: Allergy[]
}

export function AllergiesTab({ allergies }: AllergiesTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Alergias</h3>
      {allergies?.map((allergy, index) => (
        <div key={index} className="p-4 border rounded-lg">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold">{allergy.allergen}</h4>
            <Badge className={getSeverityColor(allergy.severity)}>{getSeverityLabel(allergy.severity)}</Badge>
          </div>
          <p className="text-sm mt-2">
            <span className="font-medium">Reacción:</span> {allergy.reaction}
          </p>
        </div>
      ))}
    </div>
  )
}
