import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from 'lucide-react'

interface NoWorkingFacilityMessageProps {
  entityName: string
}

export default function NoWorkingFacilityMessage({ entityName }: NoWorkingFacilityMessageProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="text-yellow-500" />
          No hay establecimiento seleccionado
        </CardTitle>
        <CardDescription>
          Debe seleccionar un establecimiento como área de trabajo para agregar o editar {entityName}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Por favor, seleccione un establecimiento en el selector de área de trabajo antes de continuar.
        </p>
      </CardContent>
    </Card>
  )
}