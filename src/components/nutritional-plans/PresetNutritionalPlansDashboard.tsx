"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "use-debounce"

import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { Pagination } from "@/components/Pagination"
import { useToast } from "@/hooks/use-toast"
import { PAGE_SIZE } from "@/lib/prisma"
import { TableSkeleton } from "../skeletons/TableSkeleton"
import NoWorkingFacilityMessage from "../NoWorkingFacilityMessage"
import GenericDataHeader from "../GenericDataHeader"
import { columnsPresetNutritionalPlans, NutritionalPlanData } from "@/types/nutritionalPlans"
import { useDeletePresetNutritionalPlanMutation, useReplicatePresetNutritionalPlanMutation } from "@/app/(main)/(authenticated)/(admin)/entrenamiento/planes-nutricionales-preestablecidos/mutations"
import { usePresetNutritionalPlans } from "@/hooks/usePresetNutritionalPlans"
import NutritionalPlansTable from "./NutritionalPlansTable"

export default function PresetNutritionalPlansDashboard({ userId }: { userId: string }) {
  const router = useRouter()
  const { workingFacility } = useWorkingFacility()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounce(search, 400)
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof NutritionalPlanData>>(new Set(columnsPresetNutritionalPlans.map((col) => col.key)))
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectedCount, setSelectedCount] = useState(0)

  const { data, isLoading, isError, error } = usePresetNutritionalPlans(workingFacility?.id, page, debouncedSearch)
  const { mutate: deletePresetNutritionalPlan, isPending: isDeleting } = useDeletePresetNutritionalPlanMutation()
  const { mutate: replicatePresetNutritionalPlan, isPending: isReplicating } = useReplicatePresetNutritionalPlanMutation()
  const { toast } = useToast()

  useEffect(() => {
    setSelectedCount(selectedRows.length)
  }, [selectedRows])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  if (!workingFacility) return <NoWorkingFacilityMessage entityName="un plan nutricional preestablecido" />
  if (isLoading) return <TableSkeleton />
  if (isError) return <p className="text-center p-4 text-red-500">Error al cargar planes nutricionales preestablecidos: {error?.message}</p>

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
      if (prev.length === data?.presetNutritionalPlans.length) {
        return []
      }
      return data ? data.presetNutritionalPlans.map((presetNutritionalPlan) => presetNutritionalPlan.id) : []
    })
  }

  const handleDeleteSelected = () => {
    deletePresetNutritionalPlan(
      { nutritionalPlanIds: selectedRows, facilityId: workingFacility.id },
      {
        onSuccess: () => {
          setSelectedRows([])
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al eliminar el plan nutricional preestablecido",
            description: error.message,
          })
        },
      },
    )
  }

  const handleReplicateToFacility = (targetFacilityIds: string[]) => {
    replicatePresetNutritionalPlan(
      { presetNutritionalPlanIds: selectedRows, targetFacilityIds },
      {
        onSuccess: () => {
          setSelectedRows([])
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al replicar los planes nutrcionales preestablecidos",
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
        title="Planes nutricionales preestablecidos"
        selectedCount={selectedCount}
        onAdd={() => router.push("/entrenamiento/planes-nutricionales-preestablecidos/agregar")}
        onDeleteSelected={handleDeleteSelected}
        onReplicateToFacility={handleReplicateToFacility}
        columns={columnsPresetNutritionalPlans}
        visibleColumns={visibleColumns}
        onToggleColumn={(column) => toggleColumn(column as keyof NutritionalPlanData)}
        isDeleting={isDeleting}
        isReplicating={isReplicating}
        search={search}
        setSearch={setSearch}
        workingFacilityId={workingFacility?.id || ""}
        userId={userId}
        addButtonLabel="Agregar plan nutricional preestablecido"
        searchPlaceholder="Buscar planes nutricionales preestablecidos..."
        exportApiRoute={`/api/preset-nutritional-plans/${workingFacility?.id}/all-export`}
        exportFileName={`Planes_Nutricionales_Preestablecidos_${workingFacility?.name}`}
      />
      <NutritionalPlansTable
        nutritionalPlans={data ? data.presetNutritionalPlans : []}
        visibleColumns={visibleColumns}
        selectedRows={selectedRows}
        onToggleRow={toggleRowSelection}
        onToggleAllRows={toggleAllRows}
        deleteNutritionalPlan={deletePresetNutritionalPlan}
        isDeleting={isDeleting}
        isLoading={isLoading}
        isPreset={true}
      />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

