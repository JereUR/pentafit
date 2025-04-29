'use client'

import { Suspense } from 'react'

import { useClientFacility } from '@/contexts/ClientFacilityContext'
import { FacilityInfoSkeleton } from '../skeletons/FacilityInfoSkeleton'
import { FacilityDescription } from './FacilityDescription'
import { FacilityContactCard } from './FacilityContactCard'
import { FacilitySocialMedia } from './FacilitySocialMedia'

export default function FacilityInfoContent() {
  const { facility, primaryColor, isLoading } = useClientFacility()

  return (
    <main className="flex flex-col container gap-6 p-5">
      <div>
        <h1 className="text-3xl font-bold">Sobre Nosotros</h1>
      </div>
      <Suspense fallback={<FacilityInfoSkeleton primaryColor={primaryColor} />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <FacilityDescription isLoading={isLoading} name={facility?.name} primaryColor={primaryColor} description={facility?.description} slogan={facility?.metadata?.slogan} />
          </div>

          <div className="space-y-6">
            <FacilityContactCard isLoading={isLoading} primaryColor={primaryColor} phone={facility?.phone} email={facility?.email} address={facility?.address} />
            <FacilitySocialMedia isLoading={isLoading} primaryColor={primaryColor} instagram={facility?.instagram} facebook={facility?.facebook} />
          </div>
        </div>
      </Suspense>
    </main>
  )
}
