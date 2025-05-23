"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "use-debounce"

import { useActivities } from "@/hooks/useActivities"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { type ActivityData, columnsActivities } from "@/types/activity"
import { Pagination } from "@/components/Pagination"
import ActivitiesTable from "./ActivitiesTable"
import { useDeleteActivityMutation, useReplicateActivityMutation } from "@/app/(main)/(authenticated)/(admin)/actividades/mutations"
import { useToast } from "@/hooks/use-toast"
import { PAGE_SIZE } from "@/lib/prisma"
import { TableSkeleton } from "../skeletons/TableSkeleton"
import NoWorkingFacilityMessage from "../NoWorkingFacilityMessage"
import GenericDataHeader from "../GenericDataHeader"

export default function ActivitiesDashboard({ userId }: { userId: string }) {
  const router = useRouter()
  const { workingFacility } = useWorkingFacility()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounce(search, 400)
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof ActivityData>>(new Set(columnsActivities.map((col) => col.key)))
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectedCount, setSelectedCount] = useState(0)

  const { data, isLoading, isError, error } = useActivities(workingFacility?.id, page, debouncedSearch)
  const { mutate: deleteActivity, isPending: isDeleting } = useDeleteActivityMutation()
  const { mutate: replicateActivity, isPending: isReplicating } = useReplicateActivityMutation()
  const { toast } = useToast()

  useEffect(() => {
    setSelectedCount(selectedRows.length)
  }, [selectedRows])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  if (!workingFacility) return <NoWorkingFacilityMessage entityName="una actividad" />
  if (isLoading) return <TableSkeleton />
  if (isError) return <p className="text-center p-4 text-red-500">Error al cargar actividades: {error?.message}</p>

  const toggleColumn = (column: keyof ActivityData) => {
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
      if (prev.length === data?.activities.length) {
        return []
      }
      return data ? data.activities.map((activity) => activity.id) : []
    })
  }

  const handleDeleteSelected = () => {
    deleteActivity(
      { activityIds: selectedRows, facilityId: workingFacility.id },
      {
        onSuccess: () => {
          setSelectedRows([])
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al eliminar la actividad",
            description: error.message,
          })
        },
      },
    )
  }

  const handleReplicateToFacility = (targetFacilityIds: string[]) => {
    replicateActivity(
      { activityIds: selectedRows, targetFacilityIds },
      {
        onSuccess: () => {
          setSelectedRows([])
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al replicar las actividades",
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
        title="Actividades"
        selectedCount={selectedCount}
        onAdd={() => router.push("/actividades/agregar")}
        onDeleteSelected={handleDeleteSelected}
        onReplicateToFacility={handleReplicateToFacility}
        columns={columnsActivities}
        visibleColumns={visibleColumns}
        onToggleColumn={(column) => toggleColumn(column as keyof ActivityData)}
        isDeleting={isDeleting}
        isReplicating={isReplicating}
        search={search}
        setSearch={setSearch}
        workingFacilityId={workingFacility?.id || ""}
        userId={userId}
        addButtonLabel="Agregar Actividad"
        searchPlaceholder="Buscar actividades..."
        exportApiRoute={`/api/activities/${workingFacility?.id}/all-export`}
        exportFileName={`Actividades_${workingFacility?.name}`}
        associatedItemsWarning={`Esta acción también eliminará todas las agendas asociadas ${selectedCount === 1 ? 'a esta actividad' : 'a estas actividades'}.`}
      />
      <ActivitiesTable
        activities={data ? data.activities : []}
        visibleColumns={visibleColumns}
        selectedRows={selectedRows}
        onToggleRow={toggleRowSelection}
        onToggleAllRows={toggleAllRows}
        deleteActivity={deleteActivity}
        isDeleting={isDeleting}
        isLoading={isLoading}
      />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

