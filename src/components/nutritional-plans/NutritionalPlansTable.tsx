import { UseMutateFunction } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import { Table, TableBody, TableHeader, TableHead, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { columnsNutritionalPlans, NutritionalPlanData } from "@/types/nutritionalPlans"
import NutritionalPlanRow from "./NutritionalPlanRow"

interface NutritionalPlansTableProps {
  nutritionalPlans: NutritionalPlanData[]
  visibleColumns: Set<keyof NutritionalPlanData>
  selectedRows: string[]
  onToggleRow: (id: string) => void
  onToggleAllRows: () => void
  deleteNutritionalPlan: UseMutateFunction<
    {
      facilityId: string
      success: boolean
      message: string
      deletedCount?: number
    },
    Error,
    {
      nutritionalPlanIds: string | string[]
      facilityId: string
    },
    unknown
  >
  isDeleting: boolean
  isLoading: boolean
  isPreset?: boolean
}

export default function NutritionalPlansTable({
  nutritionalPlans,
  visibleColumns,
  selectedRows,
  onToggleRow,
  onToggleAllRows,
  deleteNutritionalPlan,
  isDeleting,
  isLoading,
  isPreset = false
}: NutritionalPlansTableProps) {
  return (
    <div className="w-full overflow-x-auto border rounded-md px-2 sm:px-4 py-4 sm:py-8">
      <Table className="w-full lg:table-fixed lg:overflow-x-auto">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="p-1 md:p-0 w-[50px] text-center border-r">
              <Checkbox
                checked={selectedRows.length === nutritionalPlans.length}
                onCheckedChange={onToggleAllRows}
              />
            </TableHead>
            {columnsNutritionalPlans.filter(col => visibleColumns.has(col.key)).map((column) => {
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
          </TableRow> : nutritionalPlans.length > 0 ? nutritionalPlans.map((nutritionalPlan, index) => (
            <NutritionalPlanRow
              key={nutritionalPlan.id}
              nutritionalPlan={nutritionalPlan}
              index={index}
              visibleColumns={visibleColumns}
              isSelected={selectedRows.includes(nutritionalPlan.id)}
              onToggleRow={onToggleRow}
              deleteNutritionalPlan={deleteNutritionalPlan}
              isDeleting={isDeleting}
              isPreset={isPreset}
            />
          )) : (
            <TableRow>
              <td
                colSpan={visibleColumns.size + 2}
                className="text-center text-foreground/70 italic font-medium py-4"
              >
                {isPreset ? "No hay planes nutricionales preestablecidos para mostrar." : "No hay planes nutricionales para mostrar."}
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

