"use client"
import { SquarePlus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog"
import { ReplicateConfirmationDialog } from "./ReplicateConfirmationDialog"
import ColumnSelector from "./ColumnSelector"
import ExportToExcel from "./ExportToExcel"

interface GenericDataHeaderProps<T extends { [key: string]: unknown }> {
  title: string
  selectedCount: number
  onAdd: () => void
  onDeleteSelected: () => void
  onReplicateToFacility?: (targetFacilityIds: string[]) => void
  columns: Array<{ key: keyof T; label: string }>
  visibleColumns: Set<keyof T>
  onToggleColumn: (column: keyof T) => void
  isDeleting: boolean
  isReplicating?: boolean
  search: string
  setSearch: (search: string) => void
  workingFacilityId?: string
  userId?: string
  addButtonLabel: string
  searchPlaceholder: string
  showReplicate?: boolean
  exportApiRoute?: string
  exportFileName?: string
}

export default function GenericDataHeader<T extends { [key: string]: unknown }>({
  title,
  selectedCount,
  onAdd,
  onDeleteSelected,
  onReplicateToFacility = () => { },
  columns,
  visibleColumns,
  onToggleColumn,
  isDeleting,
  isReplicating = false,
  search,
  setSearch,
  workingFacilityId = "",
  userId = "",
  addButtonLabel,
  searchPlaceholder,
  showReplicate = true,
  exportApiRoute,
  exportFileName
}: GenericDataHeaderProps<T>) {
  return (
    <div className="flex flex-col items-start gap-4 mb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex flex-col md:flex-row md:justify-between gap-2 w-full">
        <div className="flex items-center gap-2">
          <div className="w-full relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <ColumnSelector columns={columns} visibleColumns={visibleColumns} onToggleColumn={onToggleColumn} />
          {exportApiRoute && exportFileName && (
            <ExportToExcel<T>
              apiRoute={exportApiRoute}
              columns={columns as Array<{ key: Extract<keyof T, string>; label: string; width?: number }>}
              fileName={exportFileName}
            />
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          {selectedCount > 0 && (
            <>
              <DeleteConfirmationDialog
                itemName={`los ${selectedCount} elementos seleccionados`}
                onDelete={onDeleteSelected}
                isDeleting={isDeleting}
                count={selectedCount}
              />
              {showReplicate && (
                <ReplicateConfirmationDialog
                  itemName={`los ${selectedCount} elementos seleccionados`}
                  onReplicate={onReplicateToFacility}
                  isReplicating={isReplicating}
                  count={selectedCount}
                  workingFacilityId={workingFacilityId}
                  userId={userId}
                />
              )}
            </>
          )}
          <Button
            onClick={onAdd}
            className="w-full sm:w-auto bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700"
          >
            {addButtonLabel}
            <SquarePlus />
          </Button>
        </div>
      </div>
    </div>
  )
}

