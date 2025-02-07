import { UseMutateFunction } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import { Table, TableBody, TableHeader, TableHead, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { columnsDiaries, DiaryData } from "@/types/diary"
import DiaryRow from "./DiaryRow"

interface DiariesTableProps {
  diaries: DiaryData[]
  visibleColumns: Set<keyof DiaryData>
  selectedRows: string[]
  onToggleRow: (id: string) => void
  onToggleAllRows: () => void
  deleteDiary: UseMutateFunction<
    {
      facilityId: string
      success: boolean
      message: string
      deletedCount?: number
    },
    Error,
    {
      diaryIds: string | string[]
      facilityId: string
    },
    unknown
  >
  isDeleting: boolean
  isLoading: boolean
}

export default function DiariesTable({
  diaries,
  visibleColumns,
  selectedRows,
  onToggleRow,
  onToggleAllRows,
  deleteDiary,
  isDeleting,
  isLoading
}: DiariesTableProps) {
  return (
    <div className="w-full overflow-x-auto border rounded-md px-2 sm:px-4 py-4 sm:py-8">
      <Table className="w-full lg:table-fixed lg:overflow-x-auto">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="p-1 md:p-0 w-[50px] text-center border-r">
              <Checkbox
                checked={selectedRows.length === diaries.length}
                onCheckedChange={onToggleAllRows}
              />
            </TableHead>
            {columnsDiaries.filter(col => visibleColumns.has(col.key)).map((column) => (
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
          </TableRow> : diaries.length > 0 ? diaries.map((diary, index) => (
            <DiaryRow
              key={diary.id}
              diary={diary}
              index={index}
              visibleColumns={visibleColumns}
              isSelected={selectedRows.includes(diary.id)}
              onToggleRow={onToggleRow}
              deleteDiary={deleteDiary}
              isDeleting={isDeleting}
            />
          )) : (
            <TableRow>
              <td
                colSpan={visibleColumns.size + 2}
                className="text-center text-foreground/70 italic font-medium py-4"
              >
                No hay actividades en agenda para mostrar.
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

