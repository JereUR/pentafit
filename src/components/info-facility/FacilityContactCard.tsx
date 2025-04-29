'use client'

import { Phone, Mail, MapPin } from "lucide-react"

interface FacilityContactCardProps {
  isLoading: boolean
  primaryColor?: string
  phone?: string | null
  email?: string | null
  address?: string | null
}

export function FacilityContactCard({ isLoading, primaryColor, phone, email, address }: FacilityContactCardProps) {
  if (isLoading) return null

  return (
    <div className="p-6 border rounded-lg shadow-sm bg-card">
      <h3 className="text-xl font-semibold mb-4">Contacto</h3>

      <div className="space-y-3">
        {phone && (
          <div className="flex items-center gap-3">
            <Phone style={{ color: primaryColor }} className="h-5 w-5" />
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="hover:underline"
            >
              {phone}
            </a>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-3">
            <Mail style={{ color: primaryColor }} className="h-5 w-5" />
            <a
              href={`mailto:${email}?subject=Contacto`}
              className="hover:underline"
            >
              {email}
            </a>
          </div>
        )}
        {address && (
          <div className="flex items-start gap-3">
            <MapPin style={{ color: primaryColor }} className="h-5 w-5 mt-0.5" />
            <span>{address}</span>
          </div>
        )}
      </div>
    </div>
  )
}