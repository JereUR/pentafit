import { useState } from "react"
import Link from "next/link"
import { Edit, Info } from "lucide-react"
import type { UseMutateFunction } from "@tanstack/react-query"

import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { type PlanData, columnsPlans } from "@/types/plan"
import { cn } from "@/lib/utils"
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DiaryPlansDialog } from "./DiaryPlansDialog"

interface PlanRowProps {
  plan: PlanData
  index: number
  visibleColumns: Set<keyof PlanData>
  isSelected: boolean
  onToggleRow: (id: string) => void
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
}

export default function PlanRow({
  plan,
  index,
  visibleColumns,
  isSelected,
  onToggleRow,
  deletePlan,
  isDeleting,
}: PlanRowProps) {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDelete = () => {
    deletePlan(
      { plansIds: plan.id, facilityId: plan.facilityId },
      {
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al eliminar el plan",
            description: error.message,
          })
        },
      },
    )
  }

  return (
    <TableRow
      className={cn(isSelected ? "bg-primary/40 dark:bg-primary/20" : index % 2 === 0 ? "bg-card/40" : "bg-muted/20")}
    >
      <TableCell className="p-0 w-[50px] text-center">
        <Checkbox checked={isSelected} onCheckedChange={() => onToggleRow(plan.id)} />
      </TableCell>
      {columnsPlans
        .filter((col) => visibleColumns.has(col.key))
        .map((column) => (
          <TableCell key={column.key} className="border-x text-center break-words">
            {column.key === "generateInvoice" || column.key === "freeTest" || column.key === "current" ? (
              <Checkbox checked={plan[column.key] as boolean} disabled />
            ) : column.key === "startDate" || column.key === "endDate" ? (
              new Date(plan[column.key] as unknown as string).toLocaleDateString()
            ) : column.key === "diaryPlans" ? (
              <div className="flex items-center justify-center">
                <span>{plan.diaryPlans.length}</span>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <Info className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogPortal>
                    <DialogContent className="sm:max-w-[80%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%] h-[80vh] flex flex-col rounded-md">
                      <DialogHeader>
                        <DialogTitle>Actividades asociadas a {plan.name}</DialogTitle>
                      </DialogHeader>
                      <div className="flex-grow overflow-y-auto scrollbar-thin">
                        <DiaryPlansDialog diaryPlans={plan.diaryPlans} />
                      </div>
                    </DialogContent>
                  </DialogPortal>
                </Dialog>
              </div>
            ) : (
              plan[column.key]?.toString() || "-"
            )}
          </TableCell>
        ))}
      <TableCell className="text-center">
        <div className="flex flex-col items-center-center gap-2 text-xs md:text-sm">
          <Button asChild variant="outline" className="w-auto" onClick={(e) => e.stopPropagation()}>
            <Link href={`/planes/editar/${plan.id}`}>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </Link>
          </Button>
          <DeleteConfirmationDialog itemName={`el plan ${plan.name}`} onDelete={handleDelete} isDeleting={isDeleting} />
        </div>
      </TableCell>
    </TableRow>
  )
}

