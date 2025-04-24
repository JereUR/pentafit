import Image from "next/image"
import { Control } from "react-hook-form"
import { es } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format, parseISO } from "date-fns"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useAllClientsWithPlans } from "@/hooks/useAllClientsWithPlans"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { InvoiceValues } from "@/lib/validation"
import avatarPlaceholder from "@/assets/avatar-placeholder.png"

interface GeneralInfoTabInvoiceFormProps {
  control: Control<InvoiceValues>
}

export function GeneralInfoTabInvoiceForm({ control }: GeneralInfoTabInvoiceFormProps) {
  const { workingFacility } = useWorkingFacility()
  const { data: clients, isLoading: clientsLoading } = useAllClientsWithPlans(workingFacility?.id)

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="userId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Usuario</FormLabel>
            {clientsLoading ? (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un usuario" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={client.avatarUrl || avatarPlaceholder}
                          alt={`${client.firstName} ${client.lastName}`}
                          width={24}
                          height={24}
                          className="rounded-full object-cover"
                        />
                        <span>
                          {client.firstName} {client.lastName} ({client.plan.name})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="planId"
        render={() => (
          <FormItem>
            <FormLabel>Plan</FormLabel>
            <FormControl>
              <Input
                disabled
                value={clients.find((c) => c.id === control._formValues.userId)?.plan.name || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monto</FormLabel>
            <FormControl>
              <Input type="number" disabled value={field.value} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="dueDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Fecha de Vencimiento</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                  >
                    {field.value ? format(parseISO(field.value), "dd/MM/yyyy") : <span>Selecciona una fecha</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? parseISO(field.value) : undefined}
                  onSelect={(date) => field.onChange(date ? date.toISOString() : undefined)}
                  disabled={(date) => date < new Date() || date > new Date("2100-01-01")}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}