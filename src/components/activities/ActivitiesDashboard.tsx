'use client'

import { useActivities } from "@/hooks/useActivities"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"

export default function ActivitiesDashboard() {
  const { workingFacility } = useWorkingFacility()

  const { data: activities, isLoading, isError, error } = useActivities(workingFacility?.id)

  if (!workingFacility) return <p>No hay un establecimiento seleccionado.</p>

  if (isLoading) return <p>Cargando actividades...</p>
  if (isError) return <p>Error al cargar actividades: {error?.message}</p>

  console.log({ activities })

  return (
    <div>
      <h1>Actividades</h1>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>
            {activity.name}: {activity.description}
          </li>
        ))}
      </ul>
    </div>
  )
}
