'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import useSWR, { mutate } from 'swr'

import { WorkingFacility } from '@/types/facility'

interface WorkingFacilityContextType {
  workingFacility: WorkingFacility | null
  isLoading: boolean
  error: Error | null
  updateWorkingFacility: (facility: WorkingFacility | null) => void
}

const WorkingFacilityContext = createContext<WorkingFacilityContextType | undefined>(undefined)

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function WorkingFacilityProvider({ children }: { children: React.ReactNode }) {
  const [workingFacility, setWorkingFacility] = useState<WorkingFacility | null>(null)

  const { data, error, isLoading } = useSWR<WorkingFacility>('/api/facility/working-facility', fetcher)

  useEffect(() => {
    if (data) {
      setWorkingFacility(data)
    }
  }, [data])

  const updateWorkingFacility = useCallback((facility: WorkingFacility | null) => {
    setWorkingFacility(facility)
    mutate('/api/facility/working-facility')
  }, [])

  return (
    <WorkingFacilityContext.Provider
      value={{
        workingFacility,
        isLoading,
        error: error || null,
        updateWorkingFacility
      }}
    >
      {children}
    </WorkingFacilityContext.Provider>
  )
}

export function useWorkingFacility() {
  const context = useContext(WorkingFacilityContext)
  if (context === undefined) {
    throw new Error('useWorkingFacility must be used within a WorkingFacilityProvider')
  }
  return context
}

