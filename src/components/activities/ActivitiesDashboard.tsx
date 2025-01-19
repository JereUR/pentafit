'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useActivities } from "@/hooks/useActivities"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { ActivityData, columns } from "@/types/activity"
import { Pagination } from "@/components/Pagination"
import ActivitiesHeader from './ActivitiesHeader'
import ActivitiesTable from './ActivitiesTable'

export default function ActivitiesDashboard() {
  const router = useRouter()
  const { workingFacility } = useWorkingFacility()
  const [page, setPage] = useState(1)
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof ActivityData>>(new Set(columns.map(col => col.key)))
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [selectedCount, setSelectedCount] = useState(0)

  const { data, isLoading, isError, error } = useActivities(workingFacility?.id, page)

  useEffect(() => {
    setSelectedCount(selectedRows.size)
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
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const toggleAllRows = () => {
    if (selectedRows.size === data.activities.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(data.activities.map(a => a.id)))
    }
  }

  const handleDeleteSelected = () => {
    console.log(`Deleting ${selectedCount} activities`)
    // Implement delete logic here
  }

  const handleAddToFacility = () => {
    console.log(`Adding ${selectedCount} activities to facility`)
    // Implement add to facility logic here
  }

  const totalPages = Math.ceil(data.total / 10)

  return (
    <div className="w-full space-y-6">
      <ActivitiesHeader
        selectedCount={selectedCount}
        onAddActivity={() => router.push('/actividades/agregar')}
        onDeleteSelected={handleDeleteSelected}
        onAddToFacility={handleAddToFacility}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
      />
      <ActivitiesTable
        activities={data.activities}
        visibleColumns={visibleColumns}
        selectedRows={selectedRows}
        onToggleRow={toggleRowSelection}
        onToggleAllRows={toggleAllRows}
        onEditActivity={(id) => router.push(`/actividades/editar/${id}`)}
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}

