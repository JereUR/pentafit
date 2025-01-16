import { Instagram, Facebook, Mail, MapPin, Phone, Antenna } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FacilityAllInfo } from "@/types/facility"
import noLogoImage from '@/assets/no-image.png'
import noImageUser from '@/assets/avatar-placeholder.png'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Carousel } from '@/components/ui/carousel'
import { cn } from "@/lib/utils"

interface GeneralInfoTabProps {
  facility: FacilityAllInfo
}

export function GeneralInfoTab({ facility }: GeneralInfoTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="w-24 h-24 border-4 border-primary">
          <AvatarImage src={facility.logoUrl || noLogoImage.src} alt={facility.name} />
          <AvatarFallback className="text-2xl bg-primary/20">{facility.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-2xl font-bold text-primary">{facility.name}</h3>
          <p className="text-sm text-muted-foreground">{facility.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem label="Email" value={facility.email} icon={<Mail />} />
        <InfoItem label="Teléfono" value={facility.phone} icon={<Phone />} />
        <InfoItem label="Dirección" value={facility.address} icon={<MapPin />} />
        <InfoItem
          label="Estado"
          value={facility.isActive ? 'Activo' : 'Inactivo'}
          icon={<Antenna />}
        />
      </div>
      <div className="border border-input p-4 rounded-lg">
        <h4 className="font-semibold mb-2 text-primary">Redes Sociales</h4>
        <div className="flex space-x-4">
          {facility.instagram && (
            <SocialLink href={`https://instagram.com/${facility.instagram}`} label="Instagram" icon={<Instagram />} />
          )}
          {facility.facebook && (
            <SocialLink href={`https://facebook.com/${facility.facebook}`} label="Facebook" icon={<Facebook />} />
          )}
          {!facility.instagram && !facility.facebook && <p className='italic text-foreground/40'>N/A</p>}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2 text-primary">Staff</h4>
        <TooltipProvider>
          <Carousel>
            {facility.users.map((user, index) => (
              <Tooltip key={index}>
                <TooltipTrigger>
                  <div className="w-20 flex-shrink-0">
                    <Avatar className="w-16 h-16 border-2 border-primary transition-transform hover:scale-110">
                      <AvatarImage
                        src={user.avatarUrl || noImageUser.src}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                      <AvatarFallback className="bg-primary/20">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{`${user.firstName} ${user.lastName}`}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </Carousel>
        </TooltipProvider>
      </div>
    </div>
  )
}

function InfoItem({ label, value, icon }: { label: string; value: string | null | undefined; icon: React.ReactNode }) {
  return (
    <div className="p-3 rounded-md shadow-sm border border-input">
      <p className="text-sm font-medium text-primary flex items-center gap-2">
        <span>{icon}</span> {label}
      </p>
      <p className={cn('mt-1', !value && 'text-foreground/40')}>{value || 'N/A'}</p>
    </div>
  )
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-foreground hover:underline"
    >
      <span>{icon}</span> {label}
    </a>
  )
}
