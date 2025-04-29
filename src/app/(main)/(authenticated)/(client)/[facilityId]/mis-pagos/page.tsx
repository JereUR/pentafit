import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { CreditCard, FileText } from "lucide-react"

import { formatDate } from "@/lib/utils"
import { validateRequest } from "@/auth"
import MyPaymentsContent from "@/components/my-payments/MyPaymentsContent"

type Props = {
  params: Promise<{ facilityId: string }>
  searchParams: Promise<{ facilityName?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const facilityName = (await searchParams).facilityName || "Establecimiento"

  return {
    title: `Mis Pagos | ${facilityName}`,
  }
}

export default async function PaymentsPage({ params }: Props) {
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
          <h1 className="text-2xl font-semibold">Mis Pagos y Facturas</h1>
          <p className="text-muted-foreground">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <FileText className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground hidden sm:inline">Historial de transacciones</span>
        </div>
      </div>
      <MyPaymentsContent facilityId={facilityId} />
    </main>
  )
}