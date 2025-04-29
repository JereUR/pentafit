'use client'

interface FacilityDescriptionProps {
  isLoading: boolean
  name?: string
  primaryColor?: string
  description?: string | null
  slogan?: string | null
}

export function FacilityDescription({ isLoading, name, primaryColor, description, slogan }: FacilityDescriptionProps) {
  if (isLoading) return null

  return (
    <div className="space-y-4">
      <h2
        className="text-2xl font-semibold"
        style={{ color: primaryColor }}
      >
        {name ? name : "Nuestro Establecimiento"}
      </h2>
      {description ? (
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      ) : (
        <p className="text-muted-foreground italic">No hay descripción disponible</p>
      )}

      {slogan && (
        <blockquote
          className="p-4 border-l-4 bg-secondary/10 italic"
          style={{ borderColor: primaryColor }}
        >
          {`"${slogan}"`}
        </blockquote>
      )}
    </div>
  )
}