
import { Search, SquarePlus } from 'lucide-react'
import React from 'react'

import { Input } from '../ui/input'
import { DeleteConfirmationDialog } from '../DeleteConfirmationDialog'
import { ReplicateConfirmationDialog } from '../ReplicateConfirmationDialog'
import { Button } from '../ui/button'
import { columnsTeam, TeamData } from '@/types/team'
import ColumnSelector from '../ColumnSelector'

interface TeamHeaderProps {
  selectedCount: number
  onAddMember: () => void
  onDeleteSelected: () => void
  onReplicateToFacility: (targetFacilityIds: string[]) => void
  visibleColumns: Set<keyof TeamData>
  onToggleColumn: (column: keyof TeamData) => void
  isDeleting: boolean
  isReplicating: boolean
  search: string
  setSearch: (search: string) => void
  workingFacilityId: string
  userId: string
}

export default function TeamHeader({
  selectedCount,
  onAddMember,
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
}: TeamHeaderProps) {
  return (
    <div className="flex flex-col items-start gap-4 mb-4">
      <h1 className="text-2xl font-bold">Equipo</h1>
      <div className="flex flex-col md:flex-row md:justify-between gap-2 w-full">
        <div className="flex items-center gap-2">
          <div className="w-full relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar miembros..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <ColumnSelector columns={columnsTeam} visibleColumns={visibleColumns} onToggleColumn={onToggleColumn} />
        </div>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          {selectedCount > 0 && (
            <>
              <DeleteConfirmationDialog
                itemName={`los ${selectedCount} miembros seleccionados`}
                onDelete={onDeleteSelected}
                isDeleting={isDeleting}
                count={selectedCount}
              />
              <ReplicateConfirmationDialog
                itemName={`los ${selectedCount} miembros seleccionados`}
                onReplicate={onReplicateToFacility}
                isReplicating={isReplicating}
                count={selectedCount}
                workingFacilityId={workingFacilityId}
                userId={userId}
              />
            </>
          )}
          <Button
            onClick={onAddMember}
            className="w-full sm:w-auto bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700"
          >
            Agregar Miembro
            <SquarePlus />
          </Button>
        </div>
      </div>
    </div>
  )
}
