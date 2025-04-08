"use client"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md space-y-6">
        <h2 className="text-2xl font-bold">Algo salió mal</h2>
        <p className="text-muted-foreground">
          {error.message.includes("Can't reach database")
            ? "No podemos conectarnos a la base de datos en este momento. Por favor, intenta nuevamente en unos minutos."
            : "Ha ocurrido un error inesperado. Por favor, intenta nuevamente."}
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={() => reset()}>Intentar nuevamente</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Recargar página
          </Button>
        </div>
      </div>
    </div>
  )
}
