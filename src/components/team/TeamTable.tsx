import type { UseMutateFunction } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import { Table, TableBody, TableHeader, TableHead, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { columnsTeam, type TeamData } from "@/types/team"
import TeamRow from "./TeamRow"

interface TeamTableProps {
  team: TeamData[]
  visibleColumns: Set<keyof TeamData>
  selectedRows: string[]
  onToggleRow: (id: string) => void
  onToggleAllRows: () => void
  deleteMember: UseMutateFunction<{
    facilityId: string
    success: boolean
    message: string
    deletedCount: number
  } | {
    facilityId: string
    success: boolean
    message: string
    deletedCount?: undefined
  }, Error, {
    memberIds: string | string[]
    facilityId: string
  }, unknown>
  isDeleting: boolean
  isLoading: boolean
}

export default function TeamTable({
  team,
  visibleColumns,
  selectedRows,
  onToggleRow,
  onToggleAllRows,
  deleteMember,
  isDeleting,
  isLoading,
}: TeamTableProps) {
  return (
    <div className="w-full overflow-x-auto border rounded-md px-2 sm:px-4 py-4 sm:py-8">
      <Table className="w-full lg:table-fixed lg:overflow-x-auto">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="p-1 md:p-0 w-[50px] text-center border-r">
              <Checkbox checked={selectedRows.length === team.length} onCheckedChange={onToggleAllRows} />
            </TableHead>
            {columnsTeam
              .filter((col) => visibleColumns.has(col.key))
              .map((column) => (
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
          {isLoading ? (
            <TableRow>
              <td
                colSpan={visibleColumns.size + 2}
                className="text-center text-foreground/70 italic font-medium py-4"
              >
                <Loader2 className="animate-spin mx-auto" />
              </td>
            </TableRow>
          ) : team.length > 0 ? (
            team.map((member, index) => (
              <TeamRow
                key={member.id}
                member={member}
                index={index}
                visibleColumns={visibleColumns}
                isSelected={selectedRows.includes(member.id)}
                onToggleRow={onToggleRow}
                deleteMember={deleteMember}
                isDeleting={isDeleting}
              />
            ))
          ) : (
            <TableRow>
              <td
                colSpan={visibleColumns.size + 2}
                className="text-center text-foreground/70 italic font-medium py-4"
              >
                No hay integrantes para mostrar.
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

