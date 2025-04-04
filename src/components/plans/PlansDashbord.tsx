"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "use-debounce"

import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { Pagination } from "@/components/Pagination"
import { useToast } from "@/hooks/use-toast"
import { PAGE_SIZE } from "@/lib/prisma"
import { TableSkeleton } from "../skeletons/TableSkeleton"
import { columnsPlans, PlanData } from "@/types/plan"
import { usePlans } from "@/hooks/usePlans"
import { useDeletePlanMutation, useReplicatePlanMutation } from "@/app/(main)/(authenticated)/(admin)/planes/mutations"
import NoWorkingFacilityMessage from "../NoWorkingFacilityMessage"
import GenericDataHeader from "../GenericDataHeader"
import PlansTable from "./PlansTable"

export default function PlansDashboard({ userId }: { userId: string }) {
  const router = useRouter()
  const { workingFacility } = useWorkingFacility()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounce(search, 400)
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof PlanData>>(new Set(columnsPlans.map((col) => col.key)))
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectedCount, setSelectedCount] = useState(0)

  const { data, isLoading, isError, error } = usePlans(workingFacility?.id, page, debouncedSearch)
  const { mutate: deletePlan, isPending: isDeleting } = useDeletePlanMutation()
  const { mutate: replicatePlan, isPending: isReplicating } = useReplicatePlanMutation()
  const { toast } = useToast()

  useEffect(() => {
    setSelectedCount(selectedRows.length)
  }, [selectedRows])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  if (!workingFacility) return <NoWorkingFacilityMessage entityName="un plan" />
  if (isLoading) return <TableSkeleton />
  if (isError) return <p className="text-center p-4 text-red-500">Error al cargar actividades: {error?.message}</p>

  const toggleColumn = (column: keyof PlanData) => {
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
      if (prev.length === data?.plans.length) {
        return []
      }
      return data ? data.plans.map((plan) => plan.id) : []
    })
  }

  const handleDeleteSelected = () => {
    deletePlan(
      { plansIds: selectedRows, facilityId: workingFacility.id },
      {
        onSuccess: () => {
          setSelectedRows([])
        },
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

  const handleReplicateToFacility = (targetFacilityIds: string[]) => {
    replicatePlan(
      { planIds: selectedRows, targetFacilityIds },
      {
        onSuccess: () => {
          setSelectedRows([])
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al replicar los planes",
            description: error.message,
          })
        },
      },
    )
  }

  const totalPages = Math.ceil(data ? data.total / PAGE_SIZE : 0)

  return (
    <div className="w-full space-y-6 overflow-x-auto">
      <GenericDataHeader
        title="Planes"
        selectedCount={selectedCount}
        onAdd={() => router.push("/planes/agregar")}
        onDeleteSelected={handleDeleteSelected}
        onReplicateToFacility={handleReplicateToFacility}
        columns={columnsPlans}
        visibleColumns={visibleColumns}
        onToggleColumn={(column) => toggleColumn(column as keyof PlanData)}
        isDeleting={isDeleting}
        isReplicating={isReplicating}
        search={search}
        setSearch={setSearch}
        workingFacilityId={workingFacility?.id || ""}
        userId={userId}
        addButtonLabel="Agregar Plan"
        searchPlaceholder="Buscar planes..."
        exportApiRoute={`/api/plans/${workingFacility?.id}/all`}
        exportFileName={`Planes_${workingFacility?.name}`}
      />
      <PlansTable
        plans={data ? data.plans : []}
        visibleColumns={visibleColumns}
        selectedRows={selectedRows}
        onToggleRow={toggleRowSelection}
        onToggleAllRows={toggleAllRows}
        deletePlan={deletePlan}
        isDeleting={isDeleting}
        isLoading={isLoading}
      />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

