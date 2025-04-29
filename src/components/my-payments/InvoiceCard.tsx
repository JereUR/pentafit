"use client"

import { FileText, Check, Clock, X, Download } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useState } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { createRoot } from "react-dom/client"

import { Badge } from "@/components/ui/badge"
import { InvoiceData, statusColorsInvoices } from "@/types/clientPayments"
import { useToast } from "@/hooks/use-toast"
import noImage from "@/assets/no-image.png"
import LoadingButton from "../LoadingButton"
import InvoicePDFTemplate from "../invoices/InvoicePDFTemplate"
import { statusTranslations } from "@/types/invoice"
import DialogInvoiceDetails from "./DialogInvoiceDetails"

export type InvoiceCardProps = {
  invoice: InvoiceData
  primaryColor: string
}

export function InvoiceCard({ invoice, primaryColor }: InvoiceCardProps) {
  const { toast } = useToast()
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const statusIcons = {
    PENDING: <Clock className="h-4 w-4" />,
    PAID: <Check className="h-4 w-4" />,
    CANCELED: <X className="h-4 w-4" />,
    OVERDUE: <X className="h-4 w-4" />,
  }

  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = src
      img.onload = () => resolve()
      img.onerror = () => {
        img.src = noImage.src
        img.onload = () => resolve()
        img.onerror = () => reject(new Error("No se pudo cargar la imagen de respaldo"))
      }
    })
  }

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const imageSrc = invoice.facility?.logoUrl || noImage.src
      await preloadImage(imageSrc)

      const container = document.createElement("div")
      container.style.position = "absolute"
      container.style.left = "-9999px"
      document.body.appendChild(container)

      const root = createRoot(container)
      root.render(<InvoicePDFTemplate invoice={invoice} />)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const element = container.querySelector("#invoice-pdf")
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
      pdf.save(`Factura_${invoice.invoiceNumber}.pdf`)

      root.unmount()
      document.body.removeChild(container)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al generar el PDF",
        description: error instanceof Error ? error.message : "Error desconocido",
      })
    } finally {
      setIsGeneratingPDF(false)
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
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">Factura #{invoice.invoiceNumber}</h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(invoice.issueDate), "PPP", { locale: es })}
            </p>
          </div>
        </div>
        <Badge className={statusColorsInvoices[invoice.status as keyof typeof statusColorsInvoices]}>
          <div className="flex items-center gap-1">
            {statusIcons[invoice.status as keyof typeof statusIcons]}
            <span>
              {statusTranslations[invoice.status]}
            </span>
          </div>
        </Badge>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">Plan</p>
          <p className="font-medium">{invoice.plan.name}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Período</p>
          <p className="font-medium">{invoice.period}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Monto</p>
          <p className="font-medium text-lg" style={{ color: primaryColor }}>
            ${invoice.amount.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">Vencimiento</p>
          <p className="font-medium">
            {format(new Date(invoice.dueDate), "PPP", { locale: es })}
          </p>
        </div>
        <div className="flex gap-2">
          <DialogInvoiceDetails invoice={invoice} primaryColor={primaryColor} />
          <LoadingButton
            variant="default"
            size="sm"
            onClick={handleDownloadPDF}
            loading={isGeneratingPDF}
            style={{ backgroundColor: primaryColor }}
          >
            <Download /> Descargar
          </LoadingButton>
        </div>
      </div>
    </div>
  )
}