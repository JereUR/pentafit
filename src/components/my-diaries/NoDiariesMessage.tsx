import { Calendar } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface NoDiariesMessageProps {
  primaryColor: string
}

export const NoDiariesMessage = ({ primaryColor }: NoDiariesMessageProps) => (
  <Card className="w-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">Mi Calendario de Actividades</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col items-center justify-center py-10">
      <div className="rounded-full bg-card p-4 mb-4">
        <Calendar className="h-10 w-10" style={{ color: primaryColor }} />
      </div>
      <h3 className="text-lg font-medium mb-2">No hay agendas disponibles</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        No estás suscrito a ninguna agenda. Suscríbete a una agenda para ver tus actividades programadas.
      </p>
    </CardContent>
  </Card>
)