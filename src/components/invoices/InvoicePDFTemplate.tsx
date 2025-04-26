"use client"

import Image from "next/image"
import { InvoiceData, statusTranslations } from "@/types/invoice"
import noImage from "@/assets/no-image.png"

interface InvoicePDFTemplateProps {
  invoice: InvoiceData
}

export default function InvoicePDFTemplate({ invoice }: InvoicePDFTemplateProps) {
  const translatedStatus = statusTranslations[invoice.status] || invoice.status

  return (
    <div
      id="invoice-pdf"
      className="w-[800px] p-8 bg-white font-sans text-gray-800"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <div className="flex justify-between items-start mb-8">
        <div className="w-1/2 pr-4">
          <div className="mb-2">
            {invoice.facility.logoUrl ? (
              <Image
                src={invoice.facility.logoUrl}
                alt={`${invoice.facility.name} Logo`}
                width={120}
                height={60}
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.src = noImage.src
                }}
              />
            ) : (
              <Image
                src={noImage.src}
                alt="No Logo"
                width={120}
                height={60}
                className="object-contain"
              />
            )}
          </div>
          <h1 className="text-2xl font-bold mt-2">{invoice.facility.name}</h1>
          {invoice.facility.address && <p>{invoice.facility.address}</p>}
          {invoice.facility.email && <p>Email: {invoice.facility.email}</p>}
          {invoice.facility.phone && <p>Teléfono: {invoice.facility.phone}</p>}
          {invoice.facility.instagram && (
            <p>Instagram: {invoice.facility.instagram}</p>
          )}
          {invoice.facility.facebook && (
            <p>Facebook: {invoice.facility.facebook}</p>
          )}
        </div>
        <div className="w-1/2 text-right">
          <h2 className="text-xl font-semibold">Factura</h2>
          <p>
            <strong>Número:</strong> {invoice.invoiceNumber}
          </p>
          <p>
            <strong>Fecha de Emisión:</strong>{" "}
            {new Date(invoice.issueDate).toLocaleDateString("es-AR")}
          </p>
          <p>
            <strong>Fecha de Vencimiento:</strong>{" "}
            {new Date(invoice.dueDate).toLocaleDateString("es-AR")}
          </p>
          <p>
            <strong>Estado:</strong> {translatedStatus}
          </p>
          <p>
            <strong>Período:</strong> {invoice.period}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold">Facturado a:</h3>
        <p>
          {invoice.user.firstName} {invoice.user.lastName}
        </p>
        {invoice.user.email && <p>Email: {invoice.user.email}</p>}
      </div>

      <table className="w-full border-collapse mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Descripción</th>
            <th className="border p-2 text-right w-[120px]">Precio</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">{invoice.plan.name}</td>
            <td className="border p-2 text-right">
              ${invoice.plan.price.toFixed(2)}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr className="font-semibold">
            <td className="border p-2 text-right">Total:</td>
            <td className="border p-2 text-right">
              ${invoice.amount.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>

      {invoice.notes && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold">Notas:</h3>
          <p>{invoice.notes}</p>
        </div>
      )}

      <div className="text-center text-sm text-gray-600">
        <p>Gracias por su confianza en {invoice.facility.name}</p>
        <p>
          Para cualquier consulta, contáctenos en{" "}
          {invoice.facility.email || invoice.facility.phone || ""}
        </p>
      </div>
    </div>
  )
}