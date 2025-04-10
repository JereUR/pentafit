import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ClientWeeklyNutritionalPlan } from "@/components/my-nutritional-plan/ClientWeeklyNutritionalPlan"

type Props = {
  params: Promise<{ facilityId: string }>
  searchParams: Promise<{ facilityName?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const facilityName = (await searchParams).facilityName || "Establecimiento"

  return {
    title: `${facilityName} | Mi Plan Nutricional`,
  }
}

export default async function UserFacilityPage({ params }: Props) {
  const facilityId = (await params).facilityId

  if (!facilityId) {
    return notFound()
  }

  return (
    <main className="flex container gap-5 p-5">
      <ClientWeeklyNutritionalPlan facilityId={facilityId} />
    </main>
  )
}

