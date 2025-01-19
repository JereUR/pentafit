'use client'

import { useWorkingFacility } from '@/contexts/WorkingFacilityContext'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import noImage from '@/assets/no-image.png'
import { WorkingFacilitySkeleton } from './skeletons/WorkingFacilitySkeleton'
import FacilitiesSelector from './FacilitiesSelector'
import { useFacilities } from '@/hooks/useFacilities'
import { Card, CardContent } from './ui/card'

interface WorkingFacilityProps {
  userId: string
}

export default function WorkingFacility({ userId }: WorkingFacilityProps) {
  const { workingFacility, isLoading } = useWorkingFacility()
  const { facilities, isUpdatingFacility, setWorkingFacility } = useFacilities(userId)

  if (isLoading || isUpdatingFacility) {
    return (
      <WorkingFacilitySkeleton />
    )
  }

  return (
    <Card className="w-[300px] border-2 border-primary shadow-md">
      <CardContent className="p-2 md:p-4">
        <div className='flex flex-col gap-4'>
          <p className='text-sm md:text-base font-medium text-foreground/70 text-center'>Establecimiento en área de trabajo:</p>
          {workingFacility ?
            <div className='flex items-center gap-4 ml-1'>
              <Avatar className="w-12 h-12 md:w-16 md:h-16 ring-2 ring-primary">
                <AvatarImage src={workingFacility.logoUrl || (noImage.src as string)} alt={workingFacility.name} />
                <AvatarFallback>{workingFacility.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <p className='md:text-xl font-bold text-primary'>{workingFacility.name}</p>

            </div>
            :
            <p>Sin establecimiento en área de trabajo</p>
          }
          <FacilitiesSelector facilities={facilities} setWorkingFacility={setWorkingFacility} workingFacility={workingFacility} isUpdatingFacility={isUpdatingFacility} />
        </div>
      </CardContent>
    </Card>
  )
}

