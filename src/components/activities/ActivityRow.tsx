import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ActivityData, columns } from "@/types/activity"

interface ActivityRowProps {
  activity: ActivityData
  index: number
  visibleColumns: Set<keyof ActivityData>
  isSelected: boolean
  onToggleRow: (id: string) => void
  onEditActivity: (id: string) => void
}

export default function ActivityRow({
  activity,
  index,
  visibleColumns,
  isSelected,
  onToggleRow,
  onEditActivity
}: ActivityRowProps) {
  return (
    <TableRow className={index % 2 === 0 ? 'bg-card/40' : 'bg-muted/20'}>
      <TableCell className="text-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleRow(activity.id)}
        />
      </TableCell>
      {columns.filter(col => visibleColumns.has(col.key)).map((column) => (
        <TableCell key={column.key} className="border-x text-center">
          {column.key === 'isPublic' || column.key === 'generateInvoice' || column.key === 'mpAvailable' ? (
            <Checkbox checked={activity[column.key] as boolean} disabled />
          ) : column.key === 'startDate' || column.key === 'endDate' ? (
            new Date(activity[column.key] as unknown as string).toLocaleDateString()
          ) : (
            activity[column.key]?.toString() || '-'
          )}
        </TableCell>
      ))}
      <TableCell className="text-center">
        <div className="flex flex-col sm:flex-row justify-center gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => onEditActivity(activity.id)}>Editar</Button>
          <Button variant="destructive" size="sm" className="w-full sm:w-auto">Borrar</Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

