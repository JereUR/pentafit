"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "use-debounce"

import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { columnsTeam, TeamData } from "@/types/team"
import { useTeam } from "@/hooks/useTeam"
import { useToast } from "@/hooks/use-toast"
import { TableSkeleton } from "../skeletons/TableSkeleton"
import { PAGE_SIZE } from "@/lib/prisma"
import TeamHeader from "./TeamHeader"
import { Pagination } from "../Pagination"
import TeamTable from "./TeamTable"
import { useDeleteMemberMutation } from "@/app/(main)/(authenticated)/equipo/mutations"



export default function TeamDashboard({ userId }: { userId: string }) {
  const router = useRouter()
  const { workingFacility } = useWorkingFacility()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounce(search, 400)
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof TeamData>>(new Set(columnsTeam.map((col) => col.key)))
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectedCount, setSelectedCount] = useState(0)

  const { data, isLoading, isError, error } = useTeam(workingFacility?.id, page, debouncedSearch)
  const { mutate: deleteMember, isPending: isDeleting } = useDeleteMemberMutation()
  const { toast } = useToast()

  useEffect(() => {
    setSelectedCount(selectedRows.length)
  }, [selectedRows])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  if (!workingFacility) return <p className="text-center p-4">No hay un establecimiento seleccionado.</p>
  if (isLoading) return <TableSkeleton />
  if (isError) return <p className="text-center p-4 text-red-500">Error al cargar equipo: {error?.message}</p>

  const toggleColumn = (column: keyof TeamData) => {
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
      if (prev.length === data?.members.length) {
        return []
      }
      return data ? data.members.map((member) => member.id) : []
    })
  }

  const handleDeleteSelected = () => {
    deleteMember(
      { memberIds: selectedRows, facilityId: workingFacility.id },
      {
        onSuccess: () => {
          setSelectedRows([])
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al eliminar al integrante",
            description: error.message,
          })
        },
      },
    )
  }

  const handleReplicateToFacility = (targetFacilityIds: string[]) => {
    console.log(targetFacilityIds)
    /* replicateTeam(
      { TeamIds: selectedRows, targetFacilityIds },
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
    ) */
  }

  const totalPages = Math.ceil(data ? data.total / PAGE_SIZE : 0)

  console.log({ data })

  return (
    <div className="w-full space-y-6">
      <TeamHeader
        selectedCount={selectedCount}
        onAddMember={() => router.push("/equipo/agregar")}
        onDeleteSelected={handleDeleteSelected}
        onReplicateToFacility={handleReplicateToFacility}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
        isDeleting={isDeleting}
        isReplicating={false}
        search={search}
        setSearch={setSearch}
        workingFacilityId={workingFacility?.id || ""}
        userId={userId}
      />
      <TeamTable
        team={data ? data.members : []}
        visibleColumns={visibleColumns}
        selectedRows={selectedRows}
        onToggleRow={toggleRowSelection}
        onToggleAllRows={toggleAllRows}
        deleteMember={deleteMember}
        isDeleting={isDeleting}
        isLoading={isLoading}
      />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
