"use client"

import Image from "next/image"
import noImage from "@/assets/no-image.png"
import { PaymentData } from "@/types/clientPayments"

interface PaymentReceiptTemplateProps {
  payment: PaymentData
}

export default function PaymentReceiptTemplate({ payment }: PaymentReceiptTemplateProps) {
  return (
    <div
      id="receipt-pdf"
      className="w-[800px] p-8 bg-white font-sans text-gray-800"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <div className="flex justify-between items-start mb-8">
        <div className="w-1/2 pr-4">
          {payment.plan.facility.logoUrl ? (
            <Image
              src={payment.plan.facility.logoUrl}
              alt={`${payment.plan.facility.name} Logo`}
              width={120}
              height={60}
              className="object-contain"
            />
          ) : (
            <Image
              src={noImage}
              alt="No Logo"
              width={120}
              height={60}
              className="object-contain"
            />
          )}
          <h1 className="text-2xl font-bold mt-2">{payment.plan.facility.name}</h1>
          {payment.plan.facility.address && <p>{payment.plan.facility.address}</p>}
          {payment.plan.facility.phone && <p>Teléfono: {payment.plan.facility.phone}</p>}
        </div>
        <div className="w-1/2 text-right">
          <h2 className="text-xl font-semibold">Comprobante de Pago</h2>
          <p><strong>Número:</strong> {payment.id}</p>
          <p><strong>Fecha:</strong> {new Date(payment.paymentDate).toLocaleDateString("es-AR")}</p>
          <p><strong>Estado:</strong> Completado</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold">Detalles del Pago</h3>
        <p><strong>Plan:</strong> {payment.plan.name}</p>
        <p><strong>Tipo:</strong>
          {payment.plan.planType === "MENSUAL" && " Mensualidad"}
          {payment.plan.planType === "CLASE_UNICA" && " Clase única"}
          {payment.plan.planType === "MEMBRESIA" && " Membresía"}
        </p>
        <p><strong>Monto:</strong> ${payment.amount.toFixed(2)}</p>
        {payment.transactionId && <p><strong>ID de Transacción:</strong> {payment.transactionId}</p>}
      </div>

      <div className="text-center text-sm text-gray-600">
        <p>Gracias por su pago</p>
        <p>Para cualquier consulta, contáctenos en {payment.plan.facility.phone || payment.plan.facility.email || ""}</p>
      </div>
    </div>
  )
}