"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "use-debounce"

import { useDiaries } from "@/hooks/useDiaries"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { type DiaryData, columnsDiaries } from "@/types/diary"
import { Pagination } from "@/components/Pagination"
import { useToast } from "@/hooks/use-toast"
import { PAGE_SIZE } from "@/lib/prisma"
import { TableSkeleton } from "../skeletons/TableSkeleton"
import NoWorkingFacilityMessage from "../NoWorkingFacilityMessage"
import GenericDataHeader from "../GenericDataHeader"
import { useDeleteDiaryMutation, useReplicateDiaryMutation } from "@/app/(main)/(authenticated)/agenda/mutations"
import WeeklyScheduleDashboard from "./WeeklyScheduleDashboard"
import DiariesTable from "./DiariesTable"

export default function DiariesDashboard({ userId }: { userId: string }) {
  const router = useRouter()
  const { workingFacility } = useWorkingFacility()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounce(search, 400)
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof DiaryData>>(new Set(columnsDiaries.map((col) => col.key)))
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectedCount, setSelectedCount] = useState(0)

  const { data, isLoading, isError, error } = useDiaries(workingFacility?.id, page, debouncedSearch)
  const { mutate: deleteDiary, isPending: isDeleting } = useDeleteDiaryMutation()
  const { mutate: replicateDiary, isPending: isReplicating } = useReplicateDiaryMutation()
  const { toast } = useToast()

  useEffect(() => {
    setSelectedCount(selectedRows.length)
  }, [selectedRows])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  if (!workingFacility) return <NoWorkingFacilityMessage entityName="una agenda" />
  if (isLoading) return <TableSkeleton />
  if (isError) return <p className="text-center p-4 text-red-500">Error al cargar agenda: {error?.message}</p>

  const toggleColumn = (column: keyof DiaryData) => {
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
      if (prev.length === data?.diaries.length) {
        return []
      }
      return data ? data.diaries.map((diary) => diary.id) : []
    })
  }

  const handleDeleteSelected = () => {
    deleteDiary(
      { diaryIds: selectedRows, facilityId: workingFacility.id },
      {
        onSuccess: () => {
          setSelectedRows([])
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al eliminar la agenda",
            description: error.message,
          })
        },
      },
    )
  }

  const handleReplicateToFacility = (targetFacilityIds: string[]) => {
    replicateDiary(
      { diaryIds: selectedRows, targetFacilityIds },
      {
        onSuccess: () => {
          setSelectedRows([])
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al replicar las agendas",
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
        title="Agenda"
        selectedCount={selectedCount}
        onAdd={() => router.push("/agenda/agregar")}
        onDeleteSelected={handleDeleteSelected}
        onReplicateToFacility={handleReplicateToFacility}
        columns={columnsDiaries}
        visibleColumns={visibleColumns}
        onToggleColumn={(column) => toggleColumn(column as keyof DiaryData)}
        isDeleting={isDeleting}
        isReplicating={isReplicating}
        search={search}
        setSearch={setSearch}
        workingFacilityId={workingFacility?.id || ""}
        userId={userId}
        addButtonLabel="Agregar Agenda"
        searchPlaceholder="Buscar agendas..."
        exportApiRoute={`/api/diaries/${workingFacility?.id}/all-export`}
        exportFileName={`Agenda_${workingFacility?.name}`}
      />
      <DiariesTable
        diaries={data ? data.diaries : []}
        visibleColumns={visibleColumns}
        selectedRows={selectedRows}
        onToggleRow={toggleRowSelection}
        onToggleAllRows={toggleAllRows}
        deleteDiary={deleteDiary}
        isDeleting={isDeleting}
        isLoading={isLoading}
      />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      <WeeklyScheduleDashboard diaryData={data ? data.diaries : []} />
    </div>
  )
}

