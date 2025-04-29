"use client"

import { CreditCard, Check, Clock, X, RefreshCw, Download } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useState } from "react"
import { createRoot } from "react-dom/client"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

import { Badge } from "@/components/ui/badge"
import { PaymentData, statusColorsPayments } from "@/types/clientPayments"
import { useToast } from "@/hooks/use-toast"
import PaymentReceiptTemplate from "./PaymentReceiptTemplate"
import LoadingButton from "../LoadingButton"
import DialogPaymentDetails from "./DialogPaymentDetails"

export type PaymentCardProps = {
  payment: PaymentData
  primaryColor: string
}

export function PaymentCard({ payment, primaryColor }: PaymentCardProps) {
  const { toast } = useToast()
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false)

  const statusIcons = {
    PENDING: <Clock className="h-4 w-4" />,
    COMPLETED: <Check className="h-4 w-4" />,
    FAILED: <X className="h-4 w-4" />,
    REFUNDED: <RefreshCw className="h-4 w-4" />,
  }

  const handleDownloadReceipt = async () => {
    setIsGeneratingReceipt(true)
    try {
      const container = document.createElement("div")
      container.style.position = "absolute"
      container.style.left = "-9999px"
      document.body.appendChild(container)

      const root = createRoot(container)
      root.render(<PaymentReceiptTemplate payment={payment} />)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const element = container.querySelector("#receipt-pdf")
      if (!element) {
        throw new Error("No se pudo encontrar el elemento del PDF")
      }

      const canvas = await html2canvas(element as HTMLElement, {
        scale: 6,
        useCORS: true,
      })
      const imgData = canvas.toDataURL("image/png")

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      })

      const imgWidth = 420
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight)
      pdf.save(`Comprobante_${payment.id}.pdf`)

      root.unmount()
      document.body.removeChild(container)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al generar el comprobante",
        description: error instanceof Error ? error.message : "Error desconocido",
      })
    } finally {
      setIsGeneratingReceipt(false)
    }
  }

  return (
    <div
      className="p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
      style={{ borderColor: `${primaryColor}20` }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-full"
            style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}
          >
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">{payment.plan.name}</h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(payment.paymentDate), "PPP", { locale: es })}
            </p>
          </div>
        </div>
        <Badge className={statusColorsPayments[payment.status]}>
          <div className="flex items-center gap-1">
            {statusIcons[payment.status]}
            <span>
              {payment.status === "PENDING" && "Pendiente"}
              {payment.status === "COMPLETED" && "Completado"}
              {payment.status === "FAILED" && "Fallido"}
              {payment.status === "REFUNDED" && "Reembolsado"}
            </span>
          </div>
        </Badge>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">Tipo de plan</p>
          <p className="font-medium">
            {payment.plan.planType === "MENSUAL" && "Mensualidad"}
            {payment.plan.planType === "CLASE_UNICA" && "Clase única"}
            {payment.plan.planType === "MEMBRESIA" && "Membresía"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Monto</p>
          <p className="font-medium text-lg" style={{ color: primaryColor }}>
            ${payment.amount.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <DialogPaymentDetails payment={payment} primaryColor={primaryColor} />
        {payment.status === "COMPLETED" && (
          <LoadingButton
            variant="default"
            size="sm"
            onClick={handleDownloadReceipt}
            loading={isGeneratingReceipt}
            style={{ backgroundColor: primaryColor }}
          >
            <Download /> Descargar comprobante
          </LoadingButton>
        )}
      </div>
    </div>
  )
}