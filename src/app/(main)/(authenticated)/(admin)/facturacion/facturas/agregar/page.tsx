import { Metadata } from "next"
import { Suspense } from "react"
import { ChevronLeft, Loader2 } from "lucide-react"
import Link from "next/link"

import { validateRequest } from "@/auth"
import { Button } from "@/components/ui/button"
import InvoiceForm from "@/components/invoices/InvoiceForm"

export const metadata: Metadata = {
  title: "Agregar factura",
  description: "Agrega una nueva factura a tu establecimiento",
}

export default async function AddInvoicePage() {
  const { user } = await validateRequest()

  if (!user) return null

  return (
    <main className="relative container py-8">
      <Button variant="ghost" className="absolute -top-2 md:top-11 left-0 md:left-2 border border-input">
        <Link href="/facturacion/facturas" className="flex items-center gap-1">
          <ChevronLeft /> Volver
        </Link>
      </Button>
      <section className="w-full mx-auto">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <InvoiceFormWrapper userId={user.id} />
        </Suspense>
      </section>
    </main>
  )
}

function InvoiceFormWrapper({ userId }: { userId: string }) {
  return <InvoiceForm userId={userId} />
}