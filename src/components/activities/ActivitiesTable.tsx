import { UseMutateFunction } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import { Table, TableBody, TableHeader, TableHead, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { ActivityData, columnsActivities } from "@/types/activity"
import ActivityRow from './ActivityRow'

interface ActivitiesTableProps {
  activities: ActivityData[]
  visibleColumns: Set<keyof ActivityData>
  selectedRows: string[]
  onToggleRow: (id: string) => void
  onToggleAllRows: () => void
  deleteActivity: UseMutateFunction<{ message: string; deletedCount: number | undefined; facilityId: string; }, Error, { activityIds: string | string[]; facilityId: string; }, unknown>
  isDeleting: boolean
  isLoading: boolean
}

export default function ActivitiesTable({
  activities,
  visibleColumns,
  selectedRows,
  onToggleRow,
  onToggleAllRows,
  deleteActivity,
  isDeleting,
  isLoading
}: ActivitiesTableProps) {
  return (
    <div className="w-full overflow-x-auto border rounded-md px-2 sm:px-4 py-4 sm:py-8">
      <Table className="w-full lg:table-fixed lg:overflow-x-auto">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="p-1 md:p-0 w-[50px] text-center border-r">
              <Checkbox
                checked={selectedRows.length === activities.length}
                onCheckedChange={onToggleAllRows}
              />
            </TableHead>
            {columnsActivities.filter(col => visibleColumns.has(col.key)).map((column) => (
              <TableHead
                key={column.key}
                className='font-medium text-center border-r'
              >
                {column.label}
              </TableHead>
            ))}
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
          </TableRow> : activities.length > 0 ? activities.map((activity, index) => (
            <ActivityRow
              key={activity.id}
              activity={activity}
              index={index}
              visibleColumns={visibleColumns}
              isSelected={selectedRows.includes(activity.id)}
              onToggleRow={onToggleRow}
              deleteActivity={deleteActivity}
              isDeleting={isDeleting}
            />
          )) : (
            <TableRow>
              <td
                colSpan={visibleColumns.size + 2}
                className="text-center text-foreground/70 italic font-medium py-4"
              >
                No hay actividades para mostrar.
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

