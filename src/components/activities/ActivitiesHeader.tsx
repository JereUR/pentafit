import { SquarePlus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { type ActivityData, columnsActivities } from "@/types/activity"
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog"
import { Input } from "@/components/ui/input"
import { ReplicateConfirmationDialog } from "../ReplicateConfirmationDialog"
import ColumnSelector from "../ColumnSelector"

interface ActivitiesHeaderProps {
  selectedCount: number
  onAddActivity: () => void
  onDeleteSelected: () => void
  onReplicateToFacility: (targetFacilityIds: string[]) => void
  visibleColumns: Set<keyof ActivityData>
  onToggleColumn: (column: keyof ActivityData) => void
  isDeleting: boolean
  isReplicating: boolean
  search: string
  setSearch: (search: string) => void
  workingFacilityId: string
  userId: string
}

export default function ActivitiesHeader({
  selectedCount,
  onAddActivity,
  onDeleteSelected,
  onReplicateToFacility,
  visibleColumns,
  onToggleColumn,
  isDeleting,
  isReplicating,
  search,
  setSearch,
  workingFacilityId,
  userId
}: ActivitiesHeaderProps) {
  return (
    <div className="flex flex-col items-start gap-4 mb-4">
      <h1 className="text-2xl font-bold">Actividades</h1>
      <div className="flex flex-col md:flex-row md:justify-between gap-2 w-full">
        <div className="flex items-center gap-2">
          <div className="w-full relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar actividades..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <ColumnSelector columns={columnsActivities} visibleColumns={visibleColumns} onToggleColumn={onToggleColumn} />
        </div>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          {selectedCount > 0 && (
            <>
              <DeleteConfirmationDialog
                itemName={`las ${selectedCount} actividades seleccionadas`}
                onDelete={onDeleteSelected}
                isDeleting={isDeleting}
                count={selectedCount}
              />
              <ReplicateConfirmationDialog
                itemName={`las ${selectedCount} actividades seleccionadas`}
                onReplicate={onReplicateToFacility}
                isReplicating={isReplicating}
                count={selectedCount}
                workingFacilityId={workingFacilityId}
                userId={userId}
              />
            </>
          )}
          <Button
            onClick={onAddActivity}
            className="w-full sm:w-auto bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700"
          >
            Agregar Actividad
            <SquarePlus />
          </Button>
        </div>
      </div>
    </div>
  )
}

