"use client"

import { useState } from "react"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import ExcelIcon from "@/config/icons"

interface ExportToExcelProps<T> {
  apiRoute: string
  columns: Array<{
    key: Extract<keyof T, string>
    label: string
    width?: number
  }>
  fileName: string
  buttonText?: string
  transformData?: (data: unknown) => T[]
}

export default function ExportToExcel<T extends { [key: string]: unknown }>({
  apiRoute,
  columns,
  fileName,
  buttonText = "Exportar",
  transformData = (data) => data as T[],
}: ExportToExcelProps<T>) {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const fetchData = async (): Promise<T[]> => {
    const response = await fetch(apiRoute)
    if (!response.ok) {
      throw new Error("Failed to fetch data")
    }
    const rawData = await response.json()
    return transformData(rawData)
  }

  const exportToExcel = async () => {
    setIsExporting(true)
    try {
      const data = await fetchData()
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet("Sheet 1")

      worksheet.columns = columns.map((column) => ({
        header: column.label,
        key: column.key,
        width: column.width,
      }))

      worksheet.addRows(data)

      const buffer = await workbook.xlsx.writeBuffer()
      saveAs(new Blob([buffer]), `${fileName}.xlsx`)
      toast({
        title: "Exportación exitosa",
        description: "El archivo se ha descargado correctamente.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error exporting data:", error)
      toast({
        title: "Error en la exportación",
        description: "No se pudo exportar los datos. Por favor, intente de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 bg-card"
      onClick={exportToExcel}
      disabled={isExporting}
    >
      <ExcelIcon className="w-5 h-5" />
      {isExporting ? "Exportando..." : buttonText}
    </Button>
  )
}

