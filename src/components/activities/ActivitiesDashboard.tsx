'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { useActivities } from "@/hooks/useActivities"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { ActivityData, columns } from "@/types/activity"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export default function ActivitiesDashboard() {
  const router = useRouter()
  const { workingFacility } = useWorkingFacility()
  const [page, setPage] = useState(1)
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof ActivityData>>(new Set(columns.map(col => col.key)))
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const { data, isLoading, isError, error } = useActivities(workingFacility?.id, page)

  if (!workingFacility) return <p>No hay un establecimiento seleccionado.</p>

  if (isLoading) return <p>Cargando actividades...</p>
  if (isError) return <p>Error al cargar actividades: {error?.message}</p>

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

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Actividades</h1>
        <Button onClick={() => router.push('/actividades/agregar')}>Agregar Actividad</Button>
      </div>
      <div className="mb-4">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Columnas</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {columns.map((column) => (
              <DropdownMenuItem key={column.key} asChild>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={visibleColumns.has(column.key)}
                    onClick={(e) => e.stopPropagation()}
                    onCheckedChange={() => toggleColumn(column.key)}
                  />
                  <span>{column.label}</span>
                </div>
              </DropdownMenuItem>
            ))}
            <Button
              className="w-full mt-2"
              onClick={() => setIsDropdownOpen(false)}
            >
              Cerrar
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedRows.size === data.activities.length}
                  onCheckedChange={toggleAllRows}
                />
              </TableHead>
              {columns.filter(col => visibleColumns.has(col.key)).map((column) => (
                <TableHead key={column.key} className="font-medium">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="font-medium">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.activities.map((activity, index) => (
              <TableRow
                key={activity.id}
                className={index % 2 === 0 ? 'bg-card/40' : 'bg-muted/20'}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(activity.id)}
                    onCheckedChange={() => toggleRowSelection(activity.id)}
                  />
                </TableCell>
                {columns.filter(col => visibleColumns.has(col.key)).map((column) => (
                  <TableCell key={column.key} className="border-x">
                    {column.key === 'isPublic' || column.key === 'generateInvoice' || column.key === 'mpAvailable' ? (
                      <Checkbox checked={activity[column.key] as boolean} disabled />
                    ) : column.key === 'startDate' || column.key === 'endDate' ? (
                      new Date(activity[column.key] as unknown as string).toLocaleDateString()
                    ) : (
                      activity[column.key]?.toString() || '-'
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => router.push(`/actividades/editar/${activity.id}`)} >Editar</Button>
                  <Button variant="destructive" size="sm">Borrar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <Button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Anterior
        </Button>
        <span>Página {page} de {Math.ceil(data.total / 10)}</span>
        <Button
          onClick={() => setPage(prev => prev + 1)}
          disabled={page >= Math.ceil(data.total / 10)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}

