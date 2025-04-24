import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { validateRequest } from "@/auth"
import { Button } from "@/components/ui/button"
import { getInvoiceById } from "../../actions"
import InvoiceForm from "@/components/invoices/InvoiceForm"

export const metadata: Metadata = {
  title: "Editar factura",
  description: "Edita una factura de tu establecimiento",
}

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await validateRequest()

  if (!user) {
    redirect("/iniciar-sesion")
  }

  const { id } = await params

  const invoice = await getInvoiceById(id)

  if (!invoice) {
    redirect("/facturacion/facturas")
  }

  return (
    <main className="relative container py-8">
      <Button variant="ghost" className="absolute -top-2 md:top-11 left-0 md:left-2 border border-input">
        <Link href="/facturacion/facturas" className="flex items-center gap-1">
          <ChevronLeft /> Volver
        </Link>
      </Button>
      <InvoiceForm userId={user.id} invoiceData={invoice} />
    </main>
  )
}