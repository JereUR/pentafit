'use client'

import { Facebook, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FacilitySocialMediaProps {
  isLoading: boolean
  primaryColor?: string
  instagram?: string | null
  facebook?: string | null
}

export function FacilitySocialMedia({ isLoading, primaryColor, instagram, facebook }: FacilitySocialMediaProps) {
  if (isLoading) return null

  return (
    <div className="p-6 border rounded-lg shadow-sm bg-card">
      <h3 className="text-xl font-semibold mb-4">Redes Sociales</h3>

      <div className="flex gap-4">
        {instagram && (
          <Button
            variant="outline"
            size="icon"
            asChild
            style={{
              '--primary-color': primaryColor,
            } as React.CSSProperties}
            className={cn(
              "transition-all duration-300 ease-in-out",
              "hover:bg-[color:var(--primary-color)] hover:bg-opacity-10",
              "hover:scale-105 hover:shadow-sm",
              "active:scale-95"
            )}
          >
            <a
              href={`https://instagram.com/${instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <Instagram className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            </a>
          </Button>
        )}

        {facebook && (
          <Button
            variant="outline"
            size="icon"
            asChild
            style={{
              '--primary-color': primaryColor,
            } as React.CSSProperties}
            className={cn(
              "transition-all duration-300 ease-in-out",
              "hover:bg-[color:var(--primary-color)] hover:bg-opacity-10",
              "hover:scale-105 hover:shadow-sm",
              "active:scale-95"
            )}
          >
            <a
              href={`https://facebook.com/${facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <Facebook className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            </a>
          </Button>
        )}

        {!instagram && !facebook && (
          <p className="text-sm text-muted-foreground">No hay redes sociales disponibles</p>
        )}
      </div>
    </div>
  )
}