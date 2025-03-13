"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "use-debounce"

import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { type RoutineData, columnsRoutines } from "@/types/routine"
import { Pagination } from "@/components/Pagination"
import { useToast } from "@/hooks/use-toast"
import { PAGE_SIZE } from "@/lib/prisma"
import { TableSkeleton } from "../skeletons/TableSkeleton"
import NoWorkingFacilityMessage from "../NoWorkingFacilityMessage"
import GenericDataHeader from "../GenericDataHeader"
import { useDeleteRoutineMutation, useReplicateRoutineMutation } from "@/app/(main)/(authenticated)/entrenamiento/rutinas/mutations"
import RoutinesTable from "./RoutinesTable"
import { usePresetRoutines } from "@/hooks/usePresetRoutines"

export default function PresetRoutinesDashboard({ userId }: { userId: string }) {
  const router = useRouter()
  const { workingFacility } = useWorkingFacility()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounce(search, 400)
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof RoutineData>>(new Set(columnsRoutines.map((col) => col.key)))
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectedCount, setSelectedCount] = useState(0)

  const { data, isLoading, isError, error } = usePresetRoutines(workingFacility?.id, page, debouncedSearch)
  const { mutate: deleteRoutine, isPending: isDeleting } = useDeleteRoutineMutation()
  const { mutate: replicateRoutine, isPending: isReplicating } = useReplicateRoutineMutation()
  const { toast } = useToast()

  useEffect(() => {
    setSelectedCount(selectedRows.length)
  }, [selectedRows])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  if (!workingFacility) return <NoWorkingFacilityMessage entityName="una rutina preestablecida" />
  if (isLoading) return <TableSkeleton />
  if (isError) return <p className="text-center p-4 text-red-500">Error al cargar rutinas preestablecidas: {error?.message}</p>

  const toggleColumn = (column: keyof RoutineData) => {
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
      if (prev.length === data?.presetRoutines.length) {
        return []
      }
      return data ? data.presetRoutines.map((routine) => routine.id) : []
    })
  }

  const handleDeleteSelected = () => {
    deleteRoutine(
      { routineIds: selectedRows, facilityId: workingFacility.id },
      {
        onSuccess: () => {
          setSelectedRows([])
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al eliminar la rutina preestablecida",
            description: error.message,
          })
        },
      },
    )
  }

  const handleReplicateToFacility = (targetFacilityIds: string[]) => {
    replicateRoutine(
      { routineIds: selectedRows, targetFacilityIds },
      {
        onSuccess: () => {
          setSelectedRows([])
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al replicar las rutinas preestablecidas",
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
        title="Rutinas"
        selectedCount={selectedCount}
        onAdd={() => router.push("/entrenamiento/rutinas- preestablecidas/agregar")}
        onDeleteSelected={handleDeleteSelected}
        onReplicateToFacility={handleReplicateToFacility}
        columns={columnsRoutines}
        visibleColumns={visibleColumns}
        onToggleColumn={(column) => toggleColumn(column as keyof RoutineData)}
        isDeleting={isDeleting}
        isReplicating={isReplicating}
        search={search}
        setSearch={setSearch}
        workingFacilityId={workingFacility?.id || ""}
        userId={userId}
        addButtonLabel="Agregar Rutina Preestablecida"
        searchPlaceholder="Buscar rutinas preestablecidas..."
        exportApiRoute={`/api/preset-routines/${workingFacility?.id}/all-export`}
        exportFileName={`Rutinas_Preestablecidas_${workingFacility?.name}`}
      />
      <RoutinesTable
        routines={data ? data.presetRoutines : []}
        visibleColumns={visibleColumns}
        selectedRows={selectedRows}
        onToggleRow={toggleRowSelection}
        onToggleAllRows={toggleAllRows}
        deleteRoutine={deleteRoutine}
        isDeleting={isDeleting}
        isLoading={isLoading}
      />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

