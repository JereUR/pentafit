"use client"

import { InfoIcon } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { daysOfWeek } from "@/lib/utils"
import { Plan } from "@/types/user"

interface PlanDetailsDialogProps {
  plan: Plan
  primaryColor?: string
}

export function PlanDetailsDialog({ plan, primaryColor }: PlanDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <InfoIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px] px-2 lg:px-0 lg:max-w-[625px] max-h-[80vh] lg:max-h-[90vh] overflow-y-auto scrollbar-thin rounded-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold" style={{ color: primaryColor }}>
            Detalles del Plan: {plan.name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">Precio</h4>
                <p className="text-2xl font-bold" style={{ color: primaryColor }}>
                  ${plan.price}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">Métodos de Pago</h4>
                <div className="flex flex-wrap gap-2">
                  {plan.paymentTypes.map((type, index) => (
                    <Badge key={index} style={{ backgroundColor: primaryColor }}>
                      {type}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Actividades Disponibles</h4>
            {plan.diaryPlans.length > 0 ? (
              <div className="space-y-4">
                {plan.diaryPlans.map((dp) => (
                  <Card key={dp.id} className="overflow-hidden border-l-4" style={{ borderLeftColor: primaryColor }}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-bold text-lg">{dp.name}</h5>
                        <Badge variant="outline" className="ml-2">
                          {dp.activity.name}
                        </Badge>
                      </div>

                      {dp.activity.description && (
                        <p className="text-muted-foreground mb-3 text-sm">{dp.activity.description}</p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Días:</span>{" "}
                          {dp.daysOfWeek
                            .map((active, idx) => (active ? daysOfWeek[idx] : null))
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                        <div>
                          <span className="font-medium">Sesiones por semana:</span> {dp.sessionsPerWeek}
                        </div>
                        <div>
                          <span className="font-medium">Cupos disponibles:</span> {dp.vacancies}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No hay actividades asociadas.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
