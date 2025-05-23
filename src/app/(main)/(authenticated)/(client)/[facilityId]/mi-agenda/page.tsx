import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { Calendar } from "lucide-react"

import { formatDate } from "@/lib/utils"
import MyDiaryContent from "./MyDiaryContent"
import { validateRequest } from "@/auth"

type Props = {
  params: Promise<{ facilityId: string }>
  searchParams: Promise<{ facilityName?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const facilityName = (await searchParams).facilityName || "Establecimiento"

  return {
    title: `Mi Agenda | ${facilityName}`,
  }
}

export default async function DiaryPlansPage({ params }: Props) {
  const { user } = await validateRequest()

  if (!user) redirect("/iniciar-sesion")

  const facilityId = (await params).facilityId
  const today = new Date()
  const formattedDate = formatDate(today)

  if (!facilityId) {
    return notFound()
  }

  return (
    <main className="flex flex-col container gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Agenda de Actividades</h1>
          <p className="text-muted-foreground">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground hidden sm:inline">Inscríbete a tus actividades</span>
        </div>
      </div>
      <MyDiaryContent facilityId={facilityId} />
    </main>
  )
}

