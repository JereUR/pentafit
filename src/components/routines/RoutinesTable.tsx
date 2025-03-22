import { UseMutateFunction } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import { Table, TableBody, TableHeader, TableHead, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { columnsRoutines, RoutineData } from "@/types/routine"
import RoutineRow from "./RoutineRow"

interface RoutinesTableProps {
  routines: RoutineData[]
  visibleColumns: Set<keyof RoutineData>
  selectedRows: string[]
  onToggleRow: (id: string) => void
  onToggleAllRows: () => void
  deleteRoutine: UseMutateFunction<
    {
      facilityId: string
      success: boolean
      message: string
      deletedCount?: number
    },
    Error,
    {
      routineIds: string | string[]
      facilityId: string
    },
    unknown
  >
  isDeleting: boolean
  isLoading: boolean
  isPreset?: boolean
}

export default function RoutinesTable({
  routines,
  visibleColumns,
  selectedRows,
  onToggleRow,
  onToggleAllRows,
  deleteRoutine,
  isDeleting,
  isLoading,
  isPreset = false
}: RoutinesTableProps) {
  return (
    <div className="w-full overflow-x-auto border rounded-md px-2 sm:px-4 py-4 sm:py-8">
      <Table className="w-full lg:table-fixed lg:overflow-x-auto">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="p-1 md:p-0 w-[50px] text-center border-r">
              <Checkbox
                checked={selectedRows.length === routines.length}
                onCheckedChange={onToggleAllRows}
              />
            </TableHead>
            {columnsRoutines.filter(col => visibleColumns.has(col.key)).map((column) => {
              if (column.key === "assignedUsersCount" && !isPreset) {
                return (<TableHead
                  key={column.key}
                  className='font-medium text-center border-r'
                >
                  {column.label}
                </TableHead>)
              } else if (column.key === "assignedUsersCount" && isPreset) {
                return null
              } else

                return (
                  <TableHead
                    key={column.key}
                    className='font-medium text-center border-r'
                  >
                    {column.label}
                  </TableHead>
                )
            })}
            <TableHead className="font-medium text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? <TableRow>
            <td
              colSpan={visibleColumns.size + 2}
              className="text-center text-foreground/70 italic font-medium py-4"
            >
              <Loader2 className="animate-spin" />
            </td>
          </TableRow> : routines.length > 0 ? routines.map((routine, index) => (
            <RoutineRow
              key={routine.id}
              routine={routine}
              index={index}
              visibleColumns={visibleColumns}
              isSelected={selectedRows.includes(routine.id)}
              onToggleRow={onToggleRow}
              deleteRoutine={deleteRoutine}
              isDeleting={isDeleting}
              isPreset={isPreset}
            />
          )) : (
            <TableRow>
              <td
                colSpan={visibleColumns.size + 2}
                className="text-center text-foreground/70 italic font-medium py-4"
              >
                {isPreset ? "No hay rutinas preestablecidas para mostrar." : "No hay rutinas para mostrar."}
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

