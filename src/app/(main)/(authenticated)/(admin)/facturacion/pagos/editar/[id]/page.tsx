import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { validateRequest } from "@/auth"
import { Button } from "@/components/ui/button"
import { getPaymentById } from "../../actions"
import PaymentForm from "@/components/payments/PaymentForm"

export const metadata: Metadata = {
  title: "Editar pago",
  description: "Edita un pago de tu establecimiento",
}

export default async function EditPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await validateRequest()

  if (!user) {
    redirect("/iniciar-sesion")
  }

  const { id } = await params

  const payment = await getPaymentById(id)

  if (!payment) {
    redirect("/facturacion/pagos")
  }

  return (
    <main className="relative container py-8">
      <Button variant="ghost" className="absolute -top-2 md:top-11 left-0 md:left-2 border border-input">
        <Link href="/facturacion/pagos" className="flex items-center gap-1">
          <ChevronLeft /> Volver
        </Link>
      </Button>
      <PaymentForm userId={user.id} paymentData={payment} />
    </main>
  )
}