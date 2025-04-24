"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "use-debounce"

import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { Pagination } from "@/components/Pagination"
import { useToast } from "@/hooks/use-toast"
import { PAGE_SIZE } from "@/lib/prisma"
import { TableSkeleton } from "@/components/skeletons/TableSkeleton"
import { columnsPayments, PaymentData } from "@/types/payment"
import NoWorkingFacilityMessage from "@/components/NoWorkingFacilityMessage"
import GenericDataHeader from "@/components/GenericDataHeader"
import { usePayments } from "@/hooks/usePayments"
import { useDeletePaymentMutation } from "@/app/(main)/(authenticated)/(admin)/facturacion/pagos/mutations"
import PaymentsTable from "./PaymentsTable"

export default function PaymentsDashboard({ userId }: { userId: string }) {
  const router = useRouter()
  const { workingFacility } = useWorkingFacility()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounce(search, 400)
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof PaymentData>>(
    new Set(columnsPayments.map((col) => col.key)),
  )
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectedCount, setSelectedCount] = useState(0)

  const { data, isLoading, isError, error } = usePayments(workingFacility?.id, page, debouncedSearch)
  const { mutate: deletePayment, isPending: isDeleting } = useDeletePaymentMutation()
  const { toast } = useToast()

  useEffect(() => {
    setSelectedCount(selectedRows.length)
  }, [selectedRows])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  if (!workingFacility) return <NoWorkingFacilityMessage entityName="un pago" />
  if (isLoading) return <TableSkeleton />
  if (isError)
    return <p className="text-center p-4 text-red-500">Error al cargar pagos: {error?.message}</p>

  const toggleColumn = (column: keyof PaymentData) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(column)) {
        newSet.delete(column)
      } else {
        newSet.add(column)
      }
      return newSet
    })
  }

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => {
      if (prev.includes(id)) {
        return prev.filter((rowId) => rowId !== id)
      }
      return [...prev, id]
    })
  }

  const toggleAllRows = () => {
    setSelectedRows((prev) => {
      if (prev.length === data?.payments.length) {
        return []
      }
      return data ? data.payments.map((payment) => payment.id) : []
    })
  }

  const handleDeleteSelected = () => {
    selectedRows.forEach((id) =>
      deletePayment(id, {
        onSuccess: () => {
          setSelectedRows([])
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al eliminar el pago",
            description: error.message,
          })
        },
      }),
    )
  }

  const totalPages = Math.ceil(data ? data.total / PAGE_SIZE : 0)

  return (
    <div className="w-full space-y-6 overflow-x-auto">
      <GenericDataHeader
        title="Pagos"
        selectedCount={selectedCount}
        onAdd={() => router.push("/facturacion/pagos/agregar")}
        onDeleteSelected={handleDeleteSelected}
        columns={columnsPayments}
        visibleColumns={visibleColumns}
        onToggleColumn={(column) => toggleColumn(column as keyof PaymentData)}
        isDeleting={isDeleting}
        search={search}
        setSearch={setSearch}
        workingFacilityId={workingFacility?.id || ""}
        userId={userId}
        addButtonLabel="Agregar Pago"
        searchPlaceholder="Buscar pagos..."
        showReplicate={false}
        exportApiRoute={`/api/payments/${workingFacility?.id}/all`}
        exportFileName={`Pagos_${workingFacility?.name}`}
        associatedItemsWarning="Eliminar este pago también eliminará las facturas asociadas."
      />
      <PaymentsTable
        payments={data ? data.payments : []}
        visibleColumns={visibleColumns}
        selectedRows={selectedRows}
        onToggleRow={toggleRowSelection}
        onToggleAllRows={toggleAllRows}
        deletePayment={deletePayment}
        isDeleting={isDeleting}
        isLoading={isLoading}
      />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}