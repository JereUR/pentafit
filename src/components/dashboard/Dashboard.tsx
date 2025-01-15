'use client'

import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import noImage from '@/assets/no-image.png'
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

export default function Dashboard() {
  const { workingFacility } = useWorkingFacility()

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Establecimiento en area de trabajo:</p>
      {workingFacility ?
        <div>
          <Avatar className="w-16 h-16 sm:w-10 sm:h-10">
            <AvatarImage src={workingFacility.logoUrl || (noImage.src as string)} alt={workingFacility.name} />
            <AvatarFallback>{workingFacility.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <p>Nombre: {workingFacility.name}</p>
        </div>
        :
        <p>Sin establecimientos en area de trabajo </p>
      }
    </div>
  )
}