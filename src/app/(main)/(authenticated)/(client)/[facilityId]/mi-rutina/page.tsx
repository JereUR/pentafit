import { validateRequest } from "@/auth"
import { ClientWeeklyRoutine } from "@/components/my-routine/ClientWeeklyRoutine"
import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"


type Props = {
  params: Promise<{ facilityId: string }>
  searchParams: Promise<{ facilityName?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const facilityName = (await searchParams).facilityName || "Establecimiento"

  return {
    title: `Mi Rutina | ${facilityName}`,
  }
}

export default async function UserFacilityPage({ params }: Props) {
  const { user } = await validateRequest()

  if (!user) redirect("/iniciar-sesion")

  const facilityId = (await params).facilityId

  if (!facilityId) {
    return notFound()
  }

  return (
    <main className="flex container gap-5 p-5">
      <ClientWeeklyRoutine facilityId={facilityId} />
    </main>
  )
}

