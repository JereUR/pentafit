import { Badge } from "@/components/ui/badge"
import type { Injury } from "@/types/health"
import { getSeverityColor, getSeverityLabel } from "./healthUtils"

interface InjuriesTabProps {
  injuries: Injury[]
}

export function InjuriesTab({ injuries }: InjuriesTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Lesiones</h3>
      {injuries?.map((injury, index) => (
        <div key={index} className="p-4 border rounded-lg">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold">{injury.name}</h4>
            <Badge className={getSeverityColor(injury.severity)}>{getSeverityLabel(injury.severity)}</Badge>
          </div>
          <p className="text-sm mt-1">
            <span className="font-medium">Área afectada:</span> {injury.bodyPart}
          </p>
          {injury.dateOccurred && <p className="text-sm text-muted-foreground mt-1">Ocurrió: {injury.dateOccurred}</p>}
          {injury.affectsExercise && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded text-sm">
              <p className="font-medium text-yellow-800">Afecta al ejercicio</p>
              {injury.exerciseRestrictions && <p className="text-yellow-700">{injury.exerciseRestrictions}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
