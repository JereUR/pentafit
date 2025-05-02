import { Badge } from "@/components/ui/badge"
import type { ChronicCondition } from "@/types/health"
import { getSeverityColor, getSeverityLabel } from "./healthUtils"

interface ChronicConditionsTabProps {
  conditions: ChronicCondition[]
}

export function ChronicConditionsTab({ conditions }: ChronicConditionsTabProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="font-medium text-base sm:text-lg">Condiciones Crónicas</h3>
      {conditions?.map((condition, index) => (
        <div key={index} className="p-3 sm:p-4 border rounded-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <h4 className="font-semibold text-sm sm:text-base">{condition.name}</h4>
            <Badge className={`text-xs ${getSeverityColor(condition.severity)}`}>
              {getSeverityLabel(condition.severity)}
            </Badge>
          </div>
          {condition.diagnosisDate && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Diagnosticado: {condition.diagnosisDate}</p>
          )}
          {condition.notes && <p className="mt-2 text-xs sm:text-sm">{condition.notes}</p>}
        </div>
      ))}
    </div>
  )
}