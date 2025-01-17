'use client'

import { User } from "lucia"
import { AlertCircle, Plus } from 'lucide-react'
import Link from 'next/link'

import { useFacilities } from "@/hooks/useFacilities"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { FacilityItem } from "./FacilityItem"
import { FacilitiesDashboardSkeleton } from "../skeletons/FacilityDashboardSkeleton"

export default function FacilitiesDashboard({ user }: { user: User }) {
  const {
    facilities,
    isLoading: isLoadingFacilities,
    error: facilitiesError,
    setWorkingFacility,
    isUpdatingFacility
  } = useFacilities(user.id)

  const { workingFacility, isLoading: isLoadingWorkingFacility } = useWorkingFacility()

  if (isLoadingFacilities || isLoadingWorkingFacility) return <FacilitiesDashboardSkeleton />

  if (facilitiesError) return (
    <Alert variant="destructive" className="max-w-4xl mx-auto mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Error al cargar establecimientos: {(facilitiesError as Error).message}
      </AlertDescription>
    </Alert>
  )

  console.log({ workingFacility })

  return (
    <Card className="w-full max-w-4xl mx-auto mt-4">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">Mis Establecimientos</CardTitle>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/establecimientos/agregar">
            <Plus className="mr-2 h-4 w-4" /> Agregar Establecimiento
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {facilities && facilities.length > 0 ? (
          <div className="space-y-4">
            {facilities.map(facility => (
              <FacilityItem
                key={facility.id}
                facility={facility}
                isWorking={facility.id === workingFacility?.id}
                onWorkingChange={() => setWorkingFacility({
                  id: facility.id,
                  name: facility.name,
                  logoUrl: facility.logoUrl
                })}
                isUpdatingFacility={isUpdatingFacility}
              />
            ))}
          </div>
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

