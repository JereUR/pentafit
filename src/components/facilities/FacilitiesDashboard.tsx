'use client'

import { User } from "lucia"
import { useFacilities } from "@/hooks/useFacilities"

export default function FacilityDashboard({ user }: { user: User }) {
  const {
    facilities,
    isLoading: isLoadingFacilities,
    error: facilitiesError,
    activeFacilityId,
    setActiveFacility
  } = useFacilities(user.id)

  console.log({ facilities })

  if (isLoadingFacilities) return <div>Cargando establecimientos...</div>

  if (facilitiesError) return <div>Error al cargar establecimientos: {(facilitiesError as Error).message}</div>

  return (
    <div>
      <h1>Dashboard de Establecimientos</h1>
      <div>
        <h2>Mis Establecimientos</h2>
        {facilities && facilities.length > 0 ? (
          facilities.map(facility => (
            <button
              key={facility.id}
              onClick={() => setActiveFacility(facility.id)}
              className={facility.id === activeFacilityId ? 'bg-blue-500 text-white' : ''}
            >
              {facility.name}
            </button>
          ))
        ) : (
          <p>No cuentas con establecimientos aún.</p>
        )}
      </div>
    </div>
  )
}

