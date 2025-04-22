import type { Medication } from "@/types/health"

interface MedicationsTabProps {
  medications: Medication[]
}

export function MedicationsTab({ medications }: MedicationsTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Medicamentos</h3>
      {medications?.map((medication, index) => (
        <div key={index} className="p-4 border rounded-lg">
          <h4 className="font-semibold">{medication.name}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
            <div>
              <span className="font-medium">Dosis:</span> {medication.dosage}
            </div>
            <div>
              <span className="font-medium">Frecuencia:</span> {medication.frequency}
            </div>
          </div>
          {medication.purpose && <p className="mt-2 text-sm text-muted-foreground">{medication.purpose}</p>}
        </div>
      ))}
    </div>
  )
}
