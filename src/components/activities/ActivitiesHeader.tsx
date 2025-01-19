import { Button } from "@/components/ui/button"
import { ActivityData, columns } from "@/types/activity"
import { SquarePlus } from "lucide-react"
import ColumnSelector from "./ColumnSelector"


interface ActivitiesHeaderProps {
  selectedCount: number
  onAddActivity: () => void
  onDeleteSelected: () => void
  onAddToFacility: () => void
  visibleColumns: Set<keyof ActivityData>
  onToggleColumn: (column: keyof ActivityData) => void
}

export default function ActivitiesHeader({
  selectedCount,
  onAddActivity,
  onDeleteSelected,
  onAddToFacility,
  visibleColumns,
  onToggleColumn
}: ActivitiesHeaderProps) {
  return (
    <div className="flex flex-col justify-between items-start gap-4 mb-4">
      <h1 className="text-2xl font-bold">Actividades</h1>
      <div className="flex flex-col md:flex-row md:justify-between gap-2 w-full">
        <ColumnSelector
          columns={columns}
          visibleColumns={visibleColumns}
          onToggleColumn={onToggleColumn}
        />
        <div className="flex gap-2 items-center">
          {selectedCount > 0 && (
            <>
              <Button onClick={onDeleteSelected} variant="destructive" className="w-full sm:w-auto">
                Eliminar {selectedCount} actividad{selectedCount !== 1 ? 'es' : ''}
              </Button>
              <Button onClick={onAddToFacility} variant="secondary" className="w-full sm:w-auto">
                Agregar a establecimiento
              </Button>
            </>
          )}
          <Button onClick={onAddActivity} className="w-full sm:w-auto bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700">Agregar Actividad<SquarePlus /></Button>

        </div>
      </div>
    </div>
  )
}
