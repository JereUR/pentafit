import Image from 'next/image'

import { FacilityAllInfo } from "@/types/facility"
import noLogoImage from '@/assets/no-image.png'
import { Badge } from "@/components/ui/badge"
import { cn } from '@/lib/utils'

interface CustomizationTabProps {
  facility: FacilityAllInfo
}

export function CustomizationTab({ facility }: CustomizationTabProps) {
  return (
    <div className="space-y-6">
      {facility.metadata ? (
        <>
          <div className="flex items-center space-x-4">
            <div className="relative w-24 h-24 overflow-hidden rounded-lg border-2 border-primary bg-white">
              <Image
                src={facility.metadata.logoWebUrl || noLogoImage.src}
                alt="Logo web"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary">{facility.metadata.title || facility.name}</h3>
              <p className={cn("text-sm text-muted-foreground italic", !facility.metadata.slogan && 'text-foreground/40')}>{facility.metadata.slogan ? `"${facility.metadata.slogan}"` : 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Título" value={facility.metadata.title} />
            <InfoItem label="Slogan" value={facility.metadata.slogan} />
          </div>

          <div className="border border-input p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold mb-4 text-primary">Paleta de Colores</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ColorItem label="Color primario" color={facility.metadata.primaryColor} />
              <ColorItem label="Color secundario" color={facility.metadata.secondaryColor} />
              <ColorItem label="Color terciario" color={facility.metadata.thirdColor} />
            </div>
          </div>
        </>
      ) : (
        <p className="text-center py-4 bg-primary/5 rounded-lg">No hay información de personalización disponible.</p>
      )}
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="p-3 rounded-md shadow-sm border border-input">
      <p className="text-sm font-medium text-primary">{label}</p>
      <p className={cn('mt-1', !value && 'text-foreground/40')}>{value || 'N/A'}</p>
    </div>
  )
}

function ColorItem({ label, color }: { label: string; color: string | null | undefined }) {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 rounded-full border-2 border-gray-300" style={{ backgroundColor: color || '#000000' }}></div>
      <div>
        <p className="text-sm font-medium text-primary">{label}</p>
        <Badge className={`${!color && 'text-foreground/40'}`} variant="outline">{color || 'N/A'}</Badge>
      </div>
    </div>
  )
}

