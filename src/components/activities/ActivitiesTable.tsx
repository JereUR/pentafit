import { Table, TableBody, TableHeader, TableHead, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { ActivityData, columns } from "@/types/activity"
import ActivityRow from './ActivityRow'

interface ActivitiesTableProps {
  activities: ActivityData[]
  visibleColumns: Set<keyof ActivityData>
  selectedRows: Set<string>
  onToggleRow: (id: string) => void
  onToggleAllRows: () => void
  onEditActivity: (id: string) => void
}

export default function ActivitiesTable({
  activities,
  visibleColumns,
  selectedRows,
  onToggleRow,
  onToggleAllRows,
  onEditActivity
}: ActivitiesTableProps) {
  return (
    <div className="w-[90vw] md:w-full overflow-x-auto border rounded-md scrollbar-thin mx-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="p-1 md:p-0 w-[50px] text-center border-r">
              <Checkbox
                checked={selectedRows.size === activities.length}
                onCheckedChange={onToggleAllRows}
              />
            </TableHead>
            {columns.filter(col => visibleColumns.has(col.key)).map((column, index, array) => (
              <TableHead
                key={column.key}
                className={`font-medium text-center ${index < array.length - 1 ? 'border-r' : ''}`}
              >
                {column.label}
              </TableHead>
            ))}
            <TableHead className="font-medium text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity, index) => (
            <ActivityRow
              key={activity.id}
              activity={activity}
              index={index}
              visibleColumns={visibleColumns}
              isSelected={selectedRows.has(activity.id)}
              onToggleRow={onToggleRow}
              onEditActivity={onEditActivity}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

