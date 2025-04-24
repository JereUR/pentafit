"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "use-debounce"

import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { Pagination } from "@/components/Pagination"
import { useToast } from "@/hooks/use-toast"
import { PAGE_SIZE } from "@/lib/prisma"
import { TableSkeleton } from "@/components/skeletons/TableSkeleton"
import { columnsInvoices, InvoiceData } from "@/types/invoice"
import NoWorkingFacilityMessage from "@/components/NoWorkingFacilityMessage"
import GenericDataHeader from "@/components/GenericDataHeader"
import { useInvoices } from "@/hooks/useInvoices"
import { useDeleteInvoiceMutation } from "@/app/(main)/(authenticated)/(admin)/facturacion/facturas/mutations"
import InvoicesTable from "./InvoicesTable"

export default function InvoicesDashboard({ userId }: { userId: string }) {
  const router = useRouter()
  const { workingFacility } = useWorkingFacility()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounce(search, 400)
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof InvoiceData>>(
    new Set(columnsInvoices.map((col) => col.key)),
  )
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectedCount, setSelectedCount] = useState(0)

  const { data, isLoading, isError, error } = useInvoices(workingFacility?.id, page, debouncedSearch)
  const { mutate: deleteInvoice, isPending: isDeleting } = useDeleteInvoiceMutation()
  const { toast } = useToast()

  useEffect(() => {
    setSelectedCount(selectedRows.length)
  }, [selectedRows])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  if (!workingFacility) return <NoWorkingFacilityMessage entityName="una factura" />
  if (isLoading) return <TableSkeleton />
  if (isError)
    return <p className="text-center p-4 text-red-500">Error al cargar facturas: {error?.message}</p>

  const toggleColumn = (column: keyof InvoiceData) => {
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
      if (prev.length === data?.invoices.length) {
        return []
      }
      return data ? data.invoices.map((invoice) => invoice.id) : []
    })
  }

  const handleDeleteSelected = () => {
    selectedRows.forEach((id) =>
      deleteInvoice(id, {
        onSuccess: () => {
          setSelectedRows([])
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al eliminar la factura",
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
        title="Facturas"
        selectedCount={selectedCount}
        onAdd={() => router.push("/facturacion/facturas/agregar")}
        onDeleteSelected={handleDeleteSelected}
        columns={columnsInvoices}
        visibleColumns={visibleColumns}
        onToggleColumn={(column) => toggleColumn(column as keyof InvoiceData)}
        isDeleting={isDeleting}
        search={search}
        setSearch={setSearch}
        workingFacilityId={workingFacility?.id || ""}
        userId={userId}
        addButtonLabel="Agregar Factura"
        searchPlaceholder="Buscar facturas..."
        showReplicate={false}
        exportApiRoute={`/api/invoices/${workingFacility?.id}/all`}
        exportFileName={`Facturas_${workingFacility?.name}`}
      />
      <InvoicesTable
        invoices={data ? data.invoices : []}
        visibleColumns={visibleColumns}
        selectedRows={selectedRows}
        onToggleRow={toggleRowSelection}
        onToggleAllRows={toggleAllRows}
        deleteInvoice={deleteInvoice}
        isDeleting={isDeleting}
        isLoading={isLoading}
      />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}