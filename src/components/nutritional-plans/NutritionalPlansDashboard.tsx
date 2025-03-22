"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "use-debounce"

import { useNutritionalPlans } from "@/hooks/useNutritionalPlans"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { Pagination } from "@/components/Pagination"
import { useToast } from "@/hooks/use-toast"
import { PAGE_SIZE } from "@/lib/prisma"
import { TableSkeleton } from "../skeletons/TableSkeleton"
import NoWorkingFacilityMessage from "../NoWorkingFacilityMessage"
import GenericDataHeader from "../GenericDataHeader"
import { columnsNutritionalPlans, NutritionalPlanData } from "@/types/nutritionalPlans"
import { useDeleteNutritionalPlanMutation, useReplicateNutritionalPlanMutation } from "@/app/(main)/(authenticated)/entrenamiento/planes-nutricionales/mutations"
import NutritionalPlansTable from "./NutritionalPlansTable"

export default function NutritionalPlansDashboard({ userId }: { userId: string }) {
  const router = useRouter()
  const { workingFacility } = useWorkingFacility()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounce(search, 400)
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof NutritionalPlanData>>(new Set(columnsNutritionalPlans.map((col) => col.key)))
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectedCount, setSelectedCount] = useState(0)

  const { data, isLoading, isError, error } = useNutritionalPlans(workingFacility?.id, page, debouncedSearch)
  const { mutate: deleteNutritionalPlan, isPending: isDeleting } = useDeleteNutritionalPlanMutation()
  const { mutate: replicateNutritionalPlan, isPending: isReplicating } = useReplicateNutritionalPlanMutation()
  const { toast } = useToast()

  useEffect(() => {
    setSelectedCount(selectedRows.length)
  }, [selectedRows])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  if (!workingFacility) return <NoWorkingFacilityMessage entityName="un plan nutricional" />
  if (isLoading) return <TableSkeleton />
  if (isError) return <p className="text-center p-4 text-red-500">Error al cargar planes nutricionales: {error?.message}</p>

  const toggleColumn = (column: keyof NutritionalPlanData) => {
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
      if (prev.length === data?.nutritionalPlans.length) {
        return []
      }
      return data ? data.nutritionalPlans.map((nutritionalPlan) => nutritionalPlan.id) : []
    })
  }

  const handleDeleteSelected = () => {
    deleteNutritionalPlan(
      { nutritionalPlanIds: selectedRows, facilityId: workingFacility.id },
      {
        onSuccess: () => {
          setSelectedRows([])
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al eliminar el plan nutricional",
            description: error.message,
          })
        },
      },
    )
  }

  const handleReplicateToFacility = (targetFacilityIds: string[]) => {
    replicateNutritionalPlan(
      { nutritionalPlanIds: selectedRows, targetFacilityIds },
      {
        onSuccess: () => {
          setSelectedRows([])
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al replicar los planes nutricionales",
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
        title="Planes nutricionales"
        selectedCount={selectedCount}
        onAdd={() => router.push("/entrenamiento/planes-nutricionales/agregar")}
        onDeleteSelected={handleDeleteSelected}
        onReplicateToFacility={handleReplicateToFacility}
        columns={columnsNutritionalPlans}
        visibleColumns={visibleColumns}
        onToggleColumn={(column) => toggleColumn(column as keyof NutritionalPlanData)}
        isDeleting={isDeleting}
        isReplicating={isReplicating}
        search={search}
        setSearch={setSearch}
        workingFacilityId={workingFacility?.id || ""}
        userId={userId}
        addButtonLabel="Agregar plan nutricional"
        searchPlaceholder="Buscar planes nutricionales..."
        exportApiRoute={`/api/nutritional-plans/${workingFacility?.id}/all`}
        exportFileName={`Planes_Nutricionales_${workingFacility?.name}`}
      />
      <NutritionalPlansTable
        nutritionalPlans={data ? data.nutritionalPlans : []}
        visibleColumns={visibleColumns}
        selectedRows={selectedRows}
        onToggleRow={toggleRowSelection}
        onToggleAllRows={toggleAllRows}
        deleteNutritionalPlan={deleteNutritionalPlan}
        isDeleting={isDeleting}
        isLoading={isLoading}
      />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

