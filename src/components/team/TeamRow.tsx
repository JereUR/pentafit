import Link from "next/link"
import { Edit } from "lucide-react"
import { UseMutateFunction } from "@tanstack/react-query"

import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { TeamData, columnsTeam } from "@/types/team"
import { cn } from "@/lib/utils"
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog"
import { useToast } from "@/hooks/use-toast"

interface TeamRowProps {
  member: TeamData
  index: number
  visibleColumns: Set<keyof TeamData>
  isSelected: boolean
  onToggleRow: (id: string) => void
  deleteMember: UseMutateFunction<{ message: string; deletedCount: number | undefined; facilityId: string; }, Error, { memberIds: string | string[]; facilityId: string; }, unknown>
  isDeleting: boolean
}

export default function TeamRow({
  member,
  index,
  visibleColumns,
  isSelected,
  onToggleRow,
  deleteMember,
  isDeleting
}: TeamRowProps) {

  const { toast } = useToast()

  const handleDelete = () => {
    deleteMember({ memberIds: member.id, facilityId: member.facilityId }, {
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error al eliminar el establecimiento",
          description: error.message,
        })
      },
    })
  }

  return (
    <TableRow
      className={cn(
        isSelected ? 'bg-primary/40 dark:bg-primary/20' : index % 2 === 0 ? 'bg-card/40' : 'bg-muted/20'
      )}
    >
      <TableCell className="p-0 w-[50px] text-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleRow(member.id)}
        />
      </TableCell>
      {columnsTeam.filter(col => visibleColumns.has(col.key)).map((column) => (
        <TableCell key={column.key} className="border-x text-center">
          {member[column.key]?.toString() || '-'}
        </TableCell>
      ))}
      <TableCell className="text-center">
        <div className="flex flex-col sm:flex-row justify-center gap-2">
          <Button asChild variant="outline" className="w-full sm:w-auto" onClick={(e) => e.stopPropagation()}>
            <Link href={`/equipo/editar/${member.id}`}>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </Link>
          </Button>
          <DeleteConfirmationDialog
            itemName={`al miembro ${member.firstName} ${member.lastName}`}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </div>
      </TableCell>
    </TableRow>
  )
}

