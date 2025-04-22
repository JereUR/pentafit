"use client"

import type { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel } from "@/components/ui/form"
import type { ActivityValues } from "@/lib/validation"
import { useAllStaff } from "@/hooks/useAllStaff"
import { SelectUsers } from "../SelectUsers"

interface StaffTabActivityFormProps {
  control: Control<ActivityValues>
  facilityId: string
}

export function StaffTabActivityForm({ control, facilityId }: StaffTabActivityFormProps) {
  const { data: staffMembers, isLoading } = useAllStaff(facilityId)

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="staffIds"
        render={({ field }) => {
          console.log("StaffTabActivityForm - field value:", field.value)
          return (
            <FormItem>
              <FormLabel>Personal asignado</FormLabel>
              {isLoading ? (
                <div className="flex items-center justify-center h-60 border rounded-md">
                  <p className="text-sm text-muted-foreground">Cargando personal...</p>
                </div>
              ) : (
                <SelectUsers
                  users={staffMembers || []}
                  selectedUserIds={Array.isArray(field.value) ? field.value : []}
                  onChange={(ids) => {
                    console.log("SelectUsers onChange called with:", ids)
                    field.onChange(ids)
                  }}
                  showHealthWarnings={false}
                />
              )}
            </FormItem>
          )
        }}
      />
    </div>
  )
}

