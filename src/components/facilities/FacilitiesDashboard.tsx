'use client'

import { User } from "lucia"
import { AlertCircle, Plus } from 'lucide-react'
import Link from 'next/link'

import { useFacilities } from "@/hooks/useFacilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { FacilityItem } from "./FacilityItem"
import { FacilitiesDashboardSkeleton } from "../skeletons/FacilityDashboardSkeleton"

export default function FacilityDashboard({ user }: { user: User }) {
  const {
    facilities,
    isLoading: isLoadingFacilities,
    error: facilitiesError,
    workingFacilityId,
    setWorkingFacility
  } = useFacilities(user.id)

  if (isLoadingFacilities) return <FacilitiesDashboardSkeleton />

  if (facilitiesError) return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Error al cargar establecimientos: {(facilitiesError as Error).message}
      </AlertDescription>
    </Alert>
  )

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-3xl font-bold text-primary">Dashboard de Establecimientos</CardTitle>
        <Button asChild>
          <Link href="/establecimientos/agregar">
            <Plus className="mr-2 h-4 w-4" /> Agregar Establecimiento
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Mis Establecimientos</h2>
        {facilities && facilities.length > 0 ? (
          facilities.map(facility => (
            <FacilityItem
              key={facility.id}
              facility={facility}
              isWorking={facility.id === workingFacilityId}
              onWorkingChange={() => setWorkingFacility(facility.id)}
            />
          ))
        ) : (
          <Alert>
            <AlertTitle>No hay establecimientos</AlertTitle>
            <AlertDescription>
              No cuentas con establecimientos aún.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

