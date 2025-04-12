import { format } from "date-fns"
import { es } from "date-fns/locale"
import { LineChart, Ruler, Weight } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ProgressData } from "@/types/progress"

interface MeasurementsViewProps {
  progressData: ProgressData | null
  primaryColor: string
}

export function MeasurementsView({ progressData, primaryColor }: MeasurementsViewProps) {
  if (!progressData || !progressData.measurements) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay medidas registradas</p>
        <p className="text-sm text-muted-foreground mt-2">
          Registra tus medidas corporales para hacer un seguimiento de tu progreso físico
        </p>
      </div>
    )
  }

  const measurements = progressData.measurements
  const measurementDate = measurements.date
    ? format(new Date(measurements.date), "d 'de' MMMM, yyyy", { locale: es })
    : "No disponible"

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Weight className="h-5 w-5" style={{ color: primaryColor }} />
            Últimas Medidas
          </CardTitle>
          <CardDescription>Registradas el {measurementDate}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {measurements.weight && (
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <Weight className="h-5 w-5" style={{ color: primaryColor }} />
                </div>
                <div>
                  <p className="text-sm font-medium">Peso</p>
                  <p className="text-2xl font-bold">{measurements.weight} kg</p>
                </div>
              </div>
            )}

            {measurements.height && (
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <Ruler className="h-5 w-5" style={{ color: primaryColor }} />
                </div>
                <div>
                  <p className="text-sm font-medium">Altura</p>
                  <p className="text-2xl font-bold">{measurements.height} cm</p>
                </div>
              </div>
            )}

            {measurements.bodyFat && (
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <LineChart className="h-5 w-5" style={{ color: primaryColor }} />
                </div>
                <div>
                  <p className="text-sm font-medium">Grasa Corporal</p>
                  <p className="text-2xl font-bold">{measurements.bodyFat}%</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="measurements-details">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <Ruler className="h-4 w-4" style={{ color: primaryColor }} />
              Detalles de Medidas Corporales
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
              {measurements.chest && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Pecho</span>
                  <span>{measurements.chest} cm</span>
                </div>
              )}

              {measurements.waist && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Cintura</span>
                  <span>{measurements.waist} cm</span>
                </div>
              )}

              {measurements.hips && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Cadera</span>
                  <span>{measurements.hips} cm</span>
                </div>
              )}

              {measurements.arms && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Brazos</span>
                  <span>{measurements.arms} cm</span>
                </div>
              )}

              {measurements.thighs && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Muslos</span>
                  <span>{measurements.thighs} cm</span>
                </div>
              )}

              {measurements.muscle && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Masa Muscular</span>
                  <span>{measurements.muscle}%</span>
                </div>
              )}
            </div>

            {measurements.notes && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-1">Notas</h4>
                <p className="text-sm text-muted-foreground">{measurements.notes}</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
