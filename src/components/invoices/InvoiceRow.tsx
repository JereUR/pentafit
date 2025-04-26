"use client"

import Link from "next/link"
import { Edit } from "lucide-react"
import { useState } from "react"
import { UseMutateFunction } from "@tanstack/react-query"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { createRoot } from "react-dom/client"

import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { columnsInvoices, InvoiceData, statusTranslations } from "@/types/invoice"
import { cn } from "@/lib/utils"
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog"
import { useToast } from "@/hooks/use-toast"
import { DeletedInvoiceResponse } from "@/types/invoice"
import InvoicePDFTemplate from "./InvoicePDFTemplate"
import noImage from "@/assets/no-image.png"
import LoadingButton from "../LoadingButton"
import { PdfIcon } from "@/config/icons"

interface InvoiceRowProps {
  invoice: InvoiceData
  index: number
  visibleColumns: Set<keyof InvoiceData>
  isSelected: boolean
  onToggleRow: (id: string) => void
  deleteInvoice: UseMutateFunction<DeletedInvoiceResponse, Error, string, unknown>
  isDeleting: boolean
}

export default function InvoiceRow({
  invoice,
  index,
  visibleColumns,
  isSelected,
  onToggleRow,
  deleteInvoice,
  isDeleting,
}: InvoiceRowProps) {
  const { toast } = useToast()
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleDelete = () => {
    deleteInvoice(invoice.id, {
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error al eliminar la factura",
          description: error.message,
        })
      },
    })
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
      const imageSrc = invoice.facility.logoUrl || noImage.src
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

  const renderCellContent = (column: { key: keyof InvoiceData; label: string }) => {
    switch (column.key) {
      case "user":
        return `${invoice.user.firstName} ${invoice.user.lastName}`
      case "plan":
        return invoice.plan.name
      case "payment":
        return invoice.payment ? `${invoice.payment.id} (${invoice.payment.status})` : "-"
      case "issueDate":
      case "dueDate":
        return new Date(invoice[column.key] as Date).toLocaleDateString("es-AR")
      case "period":
        return invoice.period
      case "notes":
        return invoice.notes || "-"
      case "amount":
        return `$${invoice.amount.toFixed(2)}`
      case "status":
        return statusTranslations[invoice.status] || invoice.status
      case "invoiceNumber":
        return invoice.invoiceNumber
      default:
        return invoice[column.key]?.toString() || "-"
    }
  }

  return (
    <TableRow
      className={cn(isSelected ? "bg-primary/40 dark:bg-primary/20" : index % 2 === 0 ? "bg-card/40" : "bg-muted/20")}
    >
      <TableCell className="p-0 w-[50px] text-center">
        <Checkbox checked={isSelected} onCheckedChange={() => onToggleRow(invoice.id)} />
      </TableCell>
      {columnsInvoices
        .filter((col) => visibleColumns.has(col.key))
        .map((column) => (
          <TableCell key={column.key} className="border-x text-center break-words">
            {renderCellContent(column)}
          </TableCell>
        ))}
      <TableCell className="border-x text-center">
        <div className="flex justify-center items-center">
          <LoadingButton
            variant="outline"
            size="sm"
            onClick={handleDownloadPDF}
            loading={isGeneratingPDF}
            className="flex items-center justify-center"
          >
            <PdfIcon />
          </LoadingButton>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex flex-col items-center gap-2 text-xs">
          <Button asChild variant="outline" className="w-auto">
            <Link href={`/facturacion/facturas/editar/${invoice.id}`}>
              <Edit className="h-3 w-3 mr-1" /> Editar
            </Link>
          </Button>
          <DeleteConfirmationDialog
            itemName={`la factura ${invoice.invoiceNumber}`}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </div>
      </TableCell>
    </TableRow>
  )
}