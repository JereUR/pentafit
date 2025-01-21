'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useActivities } from "@/hooks/useActivities"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { ActivityData, columns } from "@/types/activity"
import { Pagination } from "@/components/Pagination"
import ActivitiesHeader from './ActivitiesHeader'
import ActivitiesTable from './ActivitiesTable'
import { useDeleteActivityMutation } from '@/app/(main)/(authenticated)/actividades/mutations'
import { useToast } from '@/hooks/use-toast'
import { PAGE_SIZE } from '@/lib/prisma'

export default function ActivitiesDashboard() {
  const router = useRouter()
  const { workingFacility } = useWorkingFacility()
  const [page, setPage] = useState(1)
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof ActivityData>>(new Set(columns.map(col => col.key)))
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectedCount, setSelectedCount] = useState(0)

  const { data, isLoading, isError, error } = useActivities(workingFacility?.id, page)
  const { mutate: deleteActivity, isPending: isDeleting } = useDeleteActivityMutation()
  const { toast } = useToast()

  useEffect(() => {
    setSelectedCount(selectedRows.length)
  }, [selectedRows])

  if (!workingFacility) return <p className="text-center p-4">No hay un establecimiento seleccionado.</p>
  if (isLoading) return <p className="text-center p-4">Cargando actividades...</p>
  if (isError) return <p className="text-center p-4 text-red-500">Error al cargar actividades: {error?.message}</p>

  const toggleColumn = (column: keyof ActivityData) => {
    setVisibleColumns(prev => {
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
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id)
      }
      return [...prev, id]
    })
  }

  const toggleAllRows = () => {
    setSelectedRows(prev => {
      if (prev.length === data?.activities.length) {
        return []
      }
      return data ? data.activities.map(activity => activity.id) : []
    })
  }

  const handleDeleteSelected = () => {
    deleteActivity({ activityIds: selectedRows, facilityId: workingFacility.id }, {
      onSuccess: () => {
        setSelectedRows([])
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error al eliminar el establecimiento",
          description: error.message,
        })
      },
    })
  }

  const handleAddToFacility = () => {
    console.log(`Adding ${selectedCount} activities to facility`)
  }

  const totalPages = Math.ceil(data ? data.total / PAGE_SIZE : 0)

  return (
    <div className="w-full space-y-6">
      <ActivitiesHeader
        selectedCount={selectedCount}
        onAddActivity={() => router.push('/actividades/agregar')}
        onDeleteSelected={handleDeleteSelected}
        onAddToFacility={handleAddToFacility}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
        isDeleting={isDeleting}
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
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}

