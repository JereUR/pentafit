'use client'

import { createContext, useContext, useState } from 'react'

interface WorkingFacilityContextType {
  workingFacilityId: string | null
  setWorkingFacilityId: (id: string | null) => void
}

const WorkingFacilityContext = createContext<WorkingFacilityContextType | undefined>(undefined)

export function WorkingFacilityProvider({ children }: { children: React.ReactNode }) {
  const [workingFacilityId, setWorkingFacilityId] = useState<string | null>(null)

  return (
    <WorkingFacilityContext.Provider value={{ workingFacilityId, setWorkingFacilityId }}>
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

