import { useState } from 'react'
import { format } from "date-fns"
import { es } from 'date-fns/locale'

import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { InvoiceData, statusColorsInvoices } from '@/types/clientPayments'
import { Badge } from '../ui/badge'

interface DialogInvoiceDetailsProps {
  invoice: InvoiceData
  primaryColor: string
}

export default function DialogInvoiceDetails({ invoice, primaryColor }: DialogInvoiceDetailsProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsDetailsOpen(true)}
      >
        Detalles
      </Button>
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Factura</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Número de Factura</p>
                <p className="font-medium">{invoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Emisión</p>
                <p className="font-medium">
                  {format(new Date(invoice.issueDate), "PPP", { locale: es })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-medium">{invoice.plan.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Período</p>
                <p className="font-medium">{invoice.period}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Institución</p>
                <p className="font-medium">{invoice.facility.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <Badge className={statusColorsInvoices[invoice.status as keyof typeof statusColorsInvoices]}>
                  {invoice.status === "PENDING" && "Pendiente"}
                  {invoice.status === "PAID" && "Pagada"}
                  {invoice.status === "CANCELED" && "Cancelada"}
                  {invoice.status === "OVERDUE" && "Vencida"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Monto</p>
                <p className="font-medium text-lg" style={{ color: primaryColor }}>
                  ${invoice.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vencimiento</p>
                <p className="font-medium">
                  {format(new Date(invoice.dueDate), "PPP", { locale: es })}
                </p>
              </div>
            </div>

            {invoice.payment && (
              <div>
                <p className="text-sm text-muted-foreground">Pago Asociado</p>
                <p className="font-medium">
                  {invoice.payment.id} ({invoice.payment.status})
                </p>
              </div>
            )}

            {invoice.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notas</p>
                <p className="font-medium">{invoice.notes}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
