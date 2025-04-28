"use client"

import Link from "next/link"
import { Edit } from "lucide-react"
import { UseMutateFunction } from "@tanstack/react-query"

import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { columnsPayments, PaymentData } from "@/types/payment"
import { cn } from "@/lib/utils"
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog"
import { useToast } from "@/hooks/use-toast"
import { DeletedPaymentResponse } from "@/types/payment"

interface PaymentRowProps {
  payment: PaymentData
  index: number
  visibleColumns: Set<keyof PaymentData>
  isSelected: boolean
  onToggleRow: (id: string) => void
  deletePayment: UseMutateFunction<DeletedPaymentResponse[], Error, string | string[], unknown>
  isDeleting: boolean
}

export default function PaymentRow({
  payment,
  index,
  visibleColumns,
  isSelected,
  onToggleRow,
  deletePayment,
  isDeleting,
}: PaymentRowProps) {
  const { toast } = useToast()

  const handleDelete = () => {
    deletePayment(payment.id, {
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error al eliminar el pago",
          description: error.message,
        })
      },
    })
  }

  const renderCellContent = (column: { key: keyof PaymentData; label: string }) => {
    switch (column.key) {
      case "user":
        return `${payment.user.firstName} ${payment.user.lastName}`
      case "plan":
        return payment.plan.name
      case "invoice":
        return payment.invoice ? `${payment.invoice.invoiceNumber} (${payment.invoice.status})` : "-"
      case "paymentMonth":
        return payment.paymentMonth
      case "transactionId":
        return payment.transactionId || "-"
      case "notes":
        return payment.notes || "-"
      case "amount":
        return `$${payment.amount.toFixed(2)}`
      case "status":
        return payment.status
      default:
        return payment[column.key]?.toString() || "-"
    }
  }

  return (
    <TableRow
      className={cn(isSelected ? "bg-primary/40 dark:bg-primary/20" : index % 2 === 0 ? "bg-card/40" : "bg-muted/20")}
    >
      <TableCell className="p-0 w-[50px] text-center">
        <Checkbox checked={isSelected} onCheckedChange={() => onToggleRow(payment.id)} />
      </TableCell>
      {columnsPayments
        .filter((col) => visibleColumns.has(col.key))
        .map((column) => (
          <TableCell key={column.key} className="border-x text-center break-words">
            {renderCellContent(column)}
          </TableCell>
        ))}
      <TableCell className="text-center">
        <div className="flex flex-col items-center gap-2 text-xs">
          <Button asChild variant="outline" className="w-auto">
            <Link href={`/facturacion/pagos/editar/${payment.id}`}>
              <Edit className="h-3 w-3 mr-1" /> Editar
            </Link>
          </Button>
          <DeleteConfirmationDialog
            itemName={`el pago para ${payment.user.firstName} ${payment.user.lastName}`}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </div>
      </TableCell>
    </TableRow>
  )
}