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
import { PlanValues } from "@/lib/validation"
import { planTypeOptions, paymentTypeOptions } from "@/types/plan"
import { MultiSelect } from "../ui/multi-select"

interface DetailsTabPlanFormProps {
  control: Control<PlanValues>
}

export function DetailsTabPlanForm({ control }: DetailsTabPlanFormProps) {
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
          name="expirationPeriod"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plazo de vencimiento</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value === 0 ? '' : field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="freeTest"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Ofrece clase de prueba</FormLabel>
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
          name="paymentTypes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modalidad de cobro</FormLabel>
              <FormControl>
                <MultiSelect
                  options={paymentTypeOptions.map((option) => ({
                    label: option.value,
                    value: option.key,
                  }))}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder="Seleccionar modalidades de cobro"
                  searchText="Buscar modalidad de cobro"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="current"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Vigente</FormLabel>
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
          name="planType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de plan</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo de actividad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {planTypeOptions.map((type) => (
                    <SelectItem key={type.key} value={type.key}>
                      {type.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

