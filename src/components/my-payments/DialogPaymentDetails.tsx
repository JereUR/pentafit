import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { PaymentData, statusColorsPayments } from "@/types/clientPayments"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Badge } from "../ui/badge"

interface DialogPaymentDetailsProps {
  payment: PaymentData
  primaryColor: string
}

export default function DialogPaymentDetails({ payment, primaryColor }: DialogPaymentDetailsProps) {
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
            <DialogTitle>Detalles del Pago</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Número de Pago</p>
                <p className="font-medium">{payment.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha</p>
                <p className="font-medium">
                  {format(new Date(payment.paymentDate), "PPP", { locale: es })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-medium">{payment.plan.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <p className="font-medium">
                  {payment.plan.planType === "MENSUAL" && "Mensualidad"}
                  {payment.plan.planType === "CLASE_UNICA" && "Clase única"}
                  {payment.plan.planType === "MEMBRESIA" && "Membresía"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Institución</p>
                <p className="font-medium">{payment.plan.facility.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <Badge className={statusColorsPayments[payment.status]}>
                  {payment.status === "PENDING" && "Pendiente"}
                  {payment.status === "COMPLETED" && "Completado"}
                  {payment.status === "FAILED" && "Fallido"}
                  {payment.status === "REFUNDED" && "Reembolsado"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Monto</p>
                <p className="font-medium text-lg" style={{ color: primaryColor }}>
                  ${payment.amount.toFixed(2)}
                </p>
              </div>
              {payment.transactionId && (
                <div>
                  <p className="text-sm text-muted-foreground">ID de Transacción</p>
                  <p className="font-medium">{payment.transactionId}</p>
                </div>
              )}
            </div>

            {payment.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notas</p>
                <p className="font-medium">{payment.notes}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
