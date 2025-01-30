import { Control, Controller } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ActivityValues } from "@/lib/validation"
import { activitiesType, paymentsType } from "@/types/activity"

interface DetailsTabActivityFormProps {
  control: Control<ActivityValues>
}

export function DetailsTabActivityForm({ control }: DetailsTabActivityFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="generateInvoice"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Generar factura</FormLabel>
                <FormDescription>
                  Generar factura automáticamente
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Controller
          name="maxSessions"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Máximo de sesiones</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value === 0 ? '' : field.value}
                />
              </FormControl>
              <FormDescription>
                Número máximo de sesiones permitidas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="mpAvailable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Disponible en MP</FormLabel>
                <FormDescription>
                  Hacer disponible en MercadoPago
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="paymentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de pago</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo de pago" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentsType.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Público</FormLabel>
                <FormDescription>
                  Hacer esta actividad visible al público
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="publicName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre público</FormLabel>
              <FormControl>
                <Input placeholder="Nombre público de la actividad" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormDescription>
                Nombre que verá el público si la actividad es pública
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="activityType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de actividad</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo de actividad" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {activitiesType.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

