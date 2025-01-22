import { useState } from 'react'

import noImage from '@/assets/no-image.png'
import { FacilityReduceData, WorkingFacility } from '@/types/facility'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

interface FacilitiesSelectorProps {
  facilities: FacilityReduceData[] | undefined
  setWorkingFacility: (facility: WorkingFacility) => void
  workingFacility: WorkingFacility | null
  isUpdatingFacility: boolean
}

export default function FacilitiesSelector({ facilities, setWorkingFacility, workingFacility, isUpdatingFacility }: FacilitiesSelectorProps) {
  const [isSelectOpen, setIsSelectOpen] = useState(false)

  const handleFacilityChange = (facilityId: string) => {
    const selectedFacility = facilities?.find(f => f.id === facilityId)
    if (selectedFacility) {
      setWorkingFacility({
        id: selectedFacility.id,
        name: selectedFacility.name,
        logoUrl: selectedFacility.logoUrl
      })
    }
  }

  const availableFacilities = facilities?.filter(f => f.id !== workingFacility?.id && f.isActive) || []

  return (
    <Select open={isSelectOpen} onValueChange={handleFacilityChange} value={workingFacility?.id} onOpenChange={setIsSelectOpen} disabled={isUpdatingFacility}>
      <SelectTrigger className="w-[80%] md:w-full mt-2 md:mt-4 mx-auto">
        <SelectValue>
          {workingFacility ? workingFacility.name : "Seleccione establecimiento"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableFacilities.length > 0 ? (
          availableFacilities.map((facility) => (
            <SelectItem
              key={facility.id}
              value={facility.id}
              className='flex justify-start gap-2 p-2 cursor-pointer transition-colors duration-200 ease-in-out'
            >
              <div className='flex items-center gap-4 px-8'>
                <Avatar className="w-8 h-8 md:w-10 md:h-10 ">
                  <AvatarImage src={facility.logoUrl || (noImage.src as string)} alt={facility.name} />
                  <AvatarFallback>{facility.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className='md:text-lg'>{facility.name}</span>
              </div>
            </SelectItem>
          ))
        ) : (
          <div className="p-4 text-xs md:text-sm text-center text-gray-500">
            No existen otros establecimientos <span className="text-primary">activos.</span>
          </div>
        )}
      </SelectContent>
    </Select>
  )
}

