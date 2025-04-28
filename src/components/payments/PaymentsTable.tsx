"use client"

import { Loader2 } from "lucide-react"
import { UseMutateFunction } from "@tanstack/react-query"

import { Table, TableBody, TableHeader, TableHead, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { columnsPayments, PaymentData } from "@/types/payment"
import { DeletedPaymentResponse } from "@/types/payment"
import PaymentRow from "./PaymentRow"

interface PaymentsTableProps {
  payments: PaymentData[]
  visibleColumns: Set<keyof PaymentData>
  selectedRows: string[]
  onToggleRow: (id: string) => void
  onToggleAllRows: () => void
  deletePayment: UseMutateFunction<DeletedPaymentResponse[], Error, string | string[], unknown>
  isDeleting: boolean
  isLoading: boolean
}

export default function PaymentsTable({
  payments,
  visibleColumns,
  selectedRows,
  onToggleRow,
  onToggleAllRows,
  deletePayment,
  isDeleting,
  isLoading,
}: PaymentsTableProps) {
  return (
    <div className="w-full overflow-x-auto border rounded-md px-2 sm:px-4 py-4 sm:py-8">
      <Table className="w-full lg:table-fixed lg:overflow-x-auto">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="p-1 md:p-0 w-[50px] text-center border-r">
              <Checkbox
                checked={selectedRows.length === payments.length}
                onCheckedChange={onToggleAllRows}
              />
            </TableHead>
            {columnsPayments
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
          ) : payments.length > 0 ? (
            payments.map((payment, index) => (
              <PaymentRow
                key={payment.id}
                payment={payment}
                index={index}
                visibleColumns={visibleColumns}
                isSelected={selectedRows.includes(payment.id)}
                onToggleRow={onToggleRow}
                deletePayment={deletePayment}
                isDeleting={isDeleting}
              />
            ))
          ) : (
            <TableRow>
              <td colSpan={visibleColumns.size + 2} className="text-center text-foreground/70 italic font-medium py-4">
                No hay pagos para mostrar.
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}