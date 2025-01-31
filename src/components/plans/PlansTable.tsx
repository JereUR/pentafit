import { UseMutateFunction } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import { Table, TableBody, TableHeader, TableHead, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { columnsPlans, PlanData } from "@/types/plan"
import PlanRow from "./PlanRow"

interface PlansTableProps {
  plans: PlanData[]
  visibleColumns: Set<keyof PlanData>
  selectedRows: string[]
  onToggleRow: (id: string) => void
  onToggleAllRows: () => void
  deletePlan: UseMutateFunction<
    {
      facilityId: string
      success: boolean
      message: string
      deletedCount?: number
    },
    Error,
    {
      plansIds: string | string[]
      facilityId: string
    },
    unknown
  >
  isDeleting: boolean
  isLoading: boolean
}

export default function PlansTable({
  plans,
  visibleColumns,
  selectedRows,
  onToggleRow,
  onToggleAllRows,
  deletePlan,
  isDeleting,
  isLoading
}: PlansTableProps) {
  return (
    <div className="w-[90vw] lg:w-full overflow-x-auto border rounded-md scrollbar-thin mx-auto md:mx-0">
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden">
          <Table className="w-full lg:table-fixed lg:overflow-x-auto">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="p-1 md:p-0 w-[50px] text-center border-r">
                  <Checkbox
                    checked={selectedRows.length === plans.length}
                    onCheckedChange={onToggleAllRows}
                  />
                </TableHead>
                {columnsPlans.filter(col => visibleColumns.has(col.key)).map((column) => (
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
              </TableRow> : plans.length > 0 ? plans.map((plan, index) => (
                <PlanRow
                  key={plan.id}
                  plan={plan}
                  index={index}
                  visibleColumns={visibleColumns}
                  isSelected={selectedRows.includes(plan.id)}
                  onToggleRow={onToggleRow}
                  deletePlan={deletePlan}
                  isDeleting={isDeleting}
                />
              )) : (
                <TableRow>
                  <td
                    colSpan={visibleColumns.size + 2}
                    className="text-center text-foreground/70 italic font-medium py-4"
                  >
                    No hay planes para mostrar.
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

