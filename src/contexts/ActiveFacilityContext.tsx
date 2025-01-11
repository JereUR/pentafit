'use client'

import React, { createContext, useContext, useState } from 'react'

interface ActiveFacilityContextType {
  activeFacilityId: string | null
  setActiveFacilityId: (id: string | null) => void
}

const ActiveFacilityContext = createContext<ActiveFacilityContextType | undefined>(undefined)

export function ActiveFacilityProvider({ children }: { children: React.ReactNode }) {
  const [activeFacilityId, setActiveFacilityId] = useState<string | null>(null)

  return (
    <ActiveFacilityContext.Provider value={{ activeFacilityId, setActiveFacilityId }}>
      {children}
    </ActiveFacilityContext.Provider>
  )
}

export function useActiveFacility() {
  const context = useContext(ActiveFacilityContext)
  if (context === undefined) {
    throw new Error('useActiveFacility must be used within an ActiveFacilityProvider')
  }
  return context
}

