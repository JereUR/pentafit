"use client"

import { Loader2 } from "lucide-react"
import { UseMutateFunction } from "@tanstack/react-query"

import { Table, TableBody, TableHeader, TableHead, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { columnsInvoices, InvoiceData } from "@/types/invoice"
import { DeletedInvoiceResponse } from "@/types/invoice"
import InvoiceRow from "./InvoiceRow"

interface InvoicesTableProps {
  invoices: InvoiceData[]
  visibleColumns: Set<keyof InvoiceData>
  selectedRows: string[]
  onToggleRow: (id: string) => void
  onToggleAllRows: () => void
  deleteInvoice: UseMutateFunction<DeletedInvoiceResponse, Error, string, unknown>
  isDeleting: boolean
  isLoading: boolean
}

export default function InvoicesTable({
  invoices,
  visibleColumns,
  selectedRows,
  onToggleRow,
  onToggleAllRows,
  deleteInvoice,
  isDeleting,
  isLoading,
}: InvoicesTableProps) {
  return (
    <div className="w-full overflow-x-auto border rounded-md px-2 sm:px-4 py-4 sm:py-8">
      <Table className="w-full lg:table-fixed lg:overflow-x-auto">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="p-1 md:p-0 w-[50px] text-center border-r">
              <Checkbox
                checked={selectedRows.length === invoices.length}
                onCheckedChange={onToggleAllRows}
              />
            </TableHead>
            {columnsInvoices
              .filter((col) => visibleColumns.has(col.key))
              .map((column) => (
                <TableHead key={column.key} className="font-medium text-center border-r">
                  {column.label}
                </TableHead>
              ))}
            <TableHead className="font-medium text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <td colSpan={visibleColumns.size + 2} className="text-center text-foreground/70 italic font-medium py-4">
                <Loader2 className="animate-spin" />
              </td>
            </TableRow>
          ) : invoices.length > 0 ? (
            invoices.map((invoice, index) => (
              <InvoiceRow
                key={invoice.id}
                invoice={invoice}
                index={index}
                visibleColumns={visibleColumns}
                isSelected={selectedRows.includes(invoice.id)}
                onToggleRow={onToggleRow}
                deleteInvoice={deleteInvoice}
                isDeleting={isDeleting}
              />
            ))
          ) : (
            <TableRow>
              <td colSpan={visibleColumns.size + 2} className="text-center text-foreground/70 italic font-medium py-4">
                No hay facturas para mostrar.
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}