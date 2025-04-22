import { Badge } from "@/components/ui/badge"
import type { ChronicCondition } from "@/types/health"
import { getSeverityColor, getSeverityLabel } from "./healthUtils"

interface ChronicConditionsTabProps {
  conditions: ChronicCondition[]
}

export function ChronicConditionsTab({ conditions }: ChronicConditionsTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Condiciones Crónicas</h3>
      {conditions?.map((condition, index) => (
        <div key={index} className="p-4 border rounded-lg">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold">{condition.name}</h4>
            <Badge className={getSeverityColor(condition.severity)}>{getSeverityLabel(condition.severity)}</Badge>
          </div>
          {condition.diagnosisDate && (
            <p className="text-sm text-muted-foreground mt-1">Diagnosticado: {condition.diagnosisDate}</p>
          )}
          {condition.notes && <p className="mt-2 text-sm">{condition.notes}</p>}
        </div>
      ))}
    </div>
  )
}
