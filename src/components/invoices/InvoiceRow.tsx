"use client"

import Link from "next/link"
import { Edit } from "lucide-react"
import { UseMutateFunction } from "@tanstack/react-query"

import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { columnsInvoices, InvoiceData } from "@/types/invoice"
import { cn } from "@/lib/utils"
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog"
import { useToast } from "@/hooks/use-toast"
import { DeletedInvoiceResponse } from "@/types/invoice"

interface InvoiceRowProps {
  invoice: InvoiceData
  index: number
  visibleColumns: Set<keyof InvoiceData>
  isSelected: boolean
  onToggleRow: (id: string) => void
  deleteInvoice: UseMutateFunction<DeletedInvoiceResponse, Error, string, unknown>
  isDeleting: boolean
}

export default function InvoiceRow({
  invoice,
  index,
  visibleColumns,
  isSelected,
  onToggleRow,
  deleteInvoice,
  isDeleting,
}: InvoiceRowProps) {
  const { toast } = useToast()

  const handleDelete = () => {
    deleteInvoice(invoice.id, {
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error al eliminar la factura",
          description: error.message,
        })
      },
    })
  }

  const renderCellContent = (column: { key: keyof InvoiceData; label: string }) => {
    switch (column.key) {
      case "user":
        return `${invoice.user.firstName} ${invoice.user.lastName}`
      case "plan":
        return invoice.plan.name
      case "payment":
        return invoice.payment ? `${invoice.payment.id} (${invoice.payment.status})` : "-"
      case "issueDate":
      case "dueDate":
        return new Date(invoice[column.key] as Date).toLocaleDateString()
      case "period":
        return invoice.period
      case "notes":
        return invoice.notes || "-"
      case "amount":
        return `$${invoice.amount.toFixed(2)}`
      case "status":
        return invoice.status
      case "invoiceNumber":
        return invoice.invoiceNumber
      default:
        return invoice[column.key]?.toString() || "-"
    }
  }

  return (
    <TableRow
      className={cn(isSelected ? "bg-primary/40 dark:bg-primary/20" : index % 2 === 0 ? "bg-card/40" : "bg-muted/20")}
    >
      <TableCell className="p-0 w-[50px] text-center">
        <Checkbox checked={isSelected} onCheckedChange={() => onToggleRow(invoice.id)} />
      </TableCell>
      {columnsInvoices
        .filter((col) => visibleColumns.has(col.key))
        .map((column) => (
          <TableCell key={column.key} className="border-x text-center break-words">
            {renderCellContent(column)}
          </TableCell>
        ))}
      <TableCell className="text-center">
        <div className="flex flex-col items-center gap-2 text-xs">
          <Button asChild variant="outline" className="w-auto">
            <Link href={`/facturacion/facturas/editar/${invoice.id}`}>
              <Edit className="h-3 w-3 mr-1" /> Editar
            </Link>
          </Button>
          <DeleteConfirmationDialog
            itemName={`la factura ${invoice.invoiceNumber}`}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </div>
      </TableCell>
    </TableRow>
  )
}