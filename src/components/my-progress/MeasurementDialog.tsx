"use client"

import { useState } from "react"
import { Ruler } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRecordMeasurementMutation } from "@/app/(main)/(authenticated)/(client)/[facilityId]/mi-progreso/mutations"


const measurementFormSchema = z.object({
  weight: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : undefined)),
  height: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : undefined)),
  bodyFat: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : undefined)),
  muscle: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : undefined)),
  chest: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : undefined)),
  waist: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : undefined)),
  hips: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : undefined)),
  arms: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : undefined)),
  thighs: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : undefined)),
  notes: z.string().optional(),
})

interface MeasurementDialogProps {
  facilityId: string
  primaryColor: string
}

export function MeasurementDialog({ facilityId, primaryColor }: MeasurementDialogProps) {
  const [open, setOpen] = useState(false)
  const recordMeasurementMutation = useRecordMeasurementMutation()

  const form = useForm<z.infer<typeof measurementFormSchema>>({
    resolver: zodResolver(measurementFormSchema),
    defaultValues: {
      weight: undefined,
      height: undefined,
      bodyFat: undefined,
      muscle: undefined,
      chest: undefined,
      waist: undefined,
      hips: undefined,
      arms: undefined,
      thighs: undefined,
      notes: "",
    },
  })

  function onSubmit(values: z.infer<typeof measurementFormSchema>) {
    recordMeasurementMutation.mutate(
      {
        facilityId,
        ...values,
      },
      {
        onSuccess: () => {
          setOpen(false)
          form.reset()
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button style={{ backgroundColor: primaryColor }}>
          <Ruler className="mr-2 h-4 w-4" />
          Registrar Medidas
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Medidas Corporales</DialogTitle>
          <DialogDescription>
            Ingresa tus medidas actuales para hacer un seguimiento de tu progreso físico.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="70.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Altura (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="175" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bodyFat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grasa Corporal (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="muscle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Masa Muscular (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="40" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Medidas Corporales (cm)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="chest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pecho</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="95" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="waist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cintura</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="80" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hips"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cadera</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="arms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brazos</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="35" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thighs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Muslos</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="55" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Observaciones adicionales..." {...field} />
                  </FormControl>
                  <FormDescription>Puedes agregar cualquier información adicional relevante.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                style={{ backgroundColor: primaryColor }}
                disabled={recordMeasurementMutation.isPending}
              >
                {recordMeasurementMutation.isPending ? "Guardando..." : "Guardar Medidas"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
