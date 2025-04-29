import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { validateRequest } from "@/auth"
import FacilityInfoContent from "@/components/info-facility/FacilityInfoContent"

type Props = {
  params: Promise<{ facilityId: string }>
  searchParams: Promise<{ facilityName?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const facilityName = (await searchParams).facilityName || "Establecimiento"

  return {
    title: `Información | ${facilityName}`,
    description: `Información de contacto y detalles sobre ${facilityName}`,
  }
}

export default async function FacilityInfoPage({ params }: Props) {
  const { user } = await validateRequest()

  if (!user) redirect("/iniciar-sesion")

  const { facilityId } = (await params)

  if (!facilityId) {
    return notFound()
  }

  return <FacilityInfoContent />
}