"use client"

import { type Control, useFieldArray } from "react-hook-form"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { MemberValues, UpdateMemberValues } from "@/lib/validation"
import { PasswordInput } from "../PasswordInput"
import { useFacilities } from "@/hooks/useFacilities"
import { rolesSelect } from "@/types/team"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import noImage from "@/assets/no-image.png"
import { MultiSelect } from "@/components/ui/multi-select"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DetailsTabMemberFormProps {
  control: Control<MemberValues | UpdateMemberValues>
  userId: string
  isEditing: boolean
}

export function DetailsTabMemberForm({ control, userId, isEditing, }: DetailsTabMemberFormProps) {
  const { facilities } = useFacilities(userId)
  const { replace } = useFieldArray({
    control,
    name: "facilities",
  })

  const handleFacilityChange = (selectedFacilityIds: string[]) => {
    const selectedFacilities = selectedFacilityIds
      .map((id) => {
        const facility = facilities?.find((f) => f.id === id)
        return facility
          ? {
            id: facility.id,
            name: facility.name,
            logoUrl: facility.logoUrl || undefined,
          }
          : null
      })
      .filter((f): f is NonNullable<typeof f> => f !== null)

    replace(selectedFacilities)
  }

  return (
    <div className="space-y-6">
      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Contraseña"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Confirmar Contraseña"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-20 text-start">
                    <SelectValue placeholder="Selecciona un rol para el integrante" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {rolesSelect.map((rol) => (
                    <SelectItem key={rol.value} value={rol.value} className="cursor-pointer">
                      <div className="flex flex-col">
                        <span>{rol.value}</span>
                        <span className="text-xs text-muted-foreground">{rol.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="facilities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Establecimientos</FormLabel>
              <FormDescription>Establecimientos a los que pertenecerá el integrante</FormDescription>
              <MultiSelect
                options={
                  facilities?.map((facility) => ({
                    label: facility.name,
                    value: facility.id,
                    icon: () => (
                      <Avatar className="w-6 h-6 mr-2">
                        <AvatarImage src={facility.logoUrl || (noImage.src as string)} alt={facility.name} />
                        <AvatarFallback>{facility.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    ),
                  })) || []
                }
                selected={field.value.map((f) => f.id)}
                onChange={(selectedIds) => {
                  handleFacilityChange(selectedIds)
                }}
                placeholder="Selecciona uno o más establecimientos"
                searchText="Buscar establecimientos..."
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

