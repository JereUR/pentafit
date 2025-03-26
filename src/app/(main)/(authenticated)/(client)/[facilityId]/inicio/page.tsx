import type { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ facilityId: string }>
  searchParams: Promise<{ facilityName?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const facilityName = (await searchParams).facilityName || "Establecimiento"

  return {
    title: `${facilityName} | Mi Establecimiento`,
  }
}

export default async function UserFacilityPage({ params, searchParams }: Props) {
  const facilityId = (await params).facilityId
  const facilityName = (await searchParams).facilityName || "Establecimiento"

  if (!facilityId) {
    return notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{facilityName}</h1>
    </div>
  )
}

