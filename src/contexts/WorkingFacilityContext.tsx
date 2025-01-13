'use client'

import { WorkingFacility } from '@/types/facility'
import { createContext, useContext, useState } from 'react'

interface WorkingFacilityContextType {
  workingFacility: WorkingFacility | null
  setWorkingFacility: (facility: WorkingFacility | null) => void
}

const WorkingFacilityContext = createContext<WorkingFacilityContextType | undefined>(undefined)

export function WorkingFacilityProvider({ children }: { children: React.ReactNode }) {
  const [workingFacility, setWorkingFacility] = useState<WorkingFacility | null>(null)

  return (
    <WorkingFacilityContext.Provider value={{ workingFacility, setWorkingFacility }}>
      {children}
    </WorkingFacilityContext.Provider>
  )
}

export function useWorkingFacility() {
  const context = useContext(WorkingFacilityContext)
  if (context === undefined) {
    throw new Error('useWorkingFacility must be used within an WorkingFacilityProvider')
  }
  return context
}

