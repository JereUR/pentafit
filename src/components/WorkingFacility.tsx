'use client'

import { useWorkingFacility } from '@/contexts/WorkingFacilityContext'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import noImage from '@/assets/no-image.png'
import { WorkingFacilitySkeleton } from './skeletons/WorkingFacilitySkeleton'

export default function WorkingFacility({ isUpdatingFacility }: { isUpdatingFacility: boolean }) {
  const { workingFacility, isLoading } = useWorkingFacility()

  if (isLoading || isUpdatingFacility) {
    return (
      <WorkingFacilitySkeleton />
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <p className='font-medium text-foreground/70 text-center'>Establecimiento en área de trabajo:</p>
      {workingFacility ?
        <div className='flex items-center gap-4 ml-1'>
          <Avatar className="w-16 h-16 ring-2 ring-primary">
            <AvatarImage src={workingFacility.logoUrl || (noImage.src as string)} alt={workingFacility.name} />
            <AvatarFallback>{workingFacility.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <p className='text-lg md:text-xl font-bold text-primary'>{workingFacility.name}</p>
        </div>
        :
        <p>Sin establecimiento en área de trabajo</p>
      }
    </div>
  )
}
