'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import useSWR, { mutate } from 'swr'
import { useParams } from 'next/navigation'
import pentaLogo from "@/assets/logo-reduce.webp"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const defaultTheme = {
  primaryColor: "#F97015",
  secondaryColor: "#333333",
  thirdColor: "#f5f5f5",
  logoWebUrl: pentaLogo.src,
}

type FacilityMetadata = {
  id: number
  title?: string | null
  primaryColor: string
  secondaryColor?: string | null
  thirdColor?: string | null
  slogan?: string | null
  logoWebUrl?: string | null
  facilityId: string
}

type Facility = {
  id: string
  name: string
  description?: string | null
  email?: string | null
  address?: string | null
  phone?: string | null
  instagram?: string | null
  facebook?: string | null
  isActive: boolean
  isWorking: boolean
  logoUrl?: string | null
  metadata?: FacilityMetadata | null
}

interface ClientFacilityContextType {
  facility: Facility | null
  isLoading: boolean
  error: Error | null
  primaryColor: string
  secondaryColor: string
  thirdColor: string
  logoWebUrl: string | null
  updateFacility: (facility: Facility | null) => void
}

const ClientFacilityContext = createContext<ClientFacilityContextType | undefined>(undefined)

export function ClientFacilityProvider({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const facilityId = params?.facilityId as string

  const { data, error, isLoading } = useSWR<Facility>(
    facilityId ? `/api/my-facilities/${facilityId}` : null,
    fetcher
  )

  const [facility, setFacility] = useState<Facility | null>(null)
  const [theme, setTheme] = useState(defaultTheme)

  useEffect(() => {
    if (data) {
      setFacility(data)
      setTheme({
        primaryColor: data.metadata?.primaryColor || defaultTheme.primaryColor,
        secondaryColor: data.metadata?.secondaryColor || defaultTheme.secondaryColor,
        thirdColor: data.metadata?.thirdColor || defaultTheme.thirdColor,
        logoWebUrl: data.logoUrl || defaultTheme.logoWebUrl,
      })
    }
  }, [data])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--facility-primary', theme.primaryColor)
    root.style.setProperty('--facility-secondary', theme.secondaryColor)
    root.style.setProperty('--facility-third', theme.thirdColor)
  }, [theme])

  const updateFacility = useCallback((facility: Facility | null) => {
    setFacility(facility)
    mutate(`/api/my-facilities/${facilityId}`)
  }, [facilityId])

  return (
    <ClientFacilityContext.Provider
      value={{
        facility,
        isLoading,
        error: error || null,
        ...theme,
        updateFacility,
      }}
    >
      {children}
    </ClientFacilityContext.Provider>
  )
}

export function useClientFacility() {
  const context = useContext(ClientFacilityContext)
  if (context === undefined) {
    throw new Error('useClientFacility must be used within a ClientFacilityProvider')
  }
  return context
}
