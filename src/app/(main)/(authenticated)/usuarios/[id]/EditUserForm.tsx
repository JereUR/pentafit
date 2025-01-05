"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { UserProfileData } from '@/types/user'
import { userProfileSchema, UserProfileValues } from "@/lib/validation"
import ErrorText from "@/components/ErrorText"
import LoadingButton from "@/components/LoadingButton"

const GENDER_OPTIONS = [
  { value: "Masculino", label: "Masculino" },
  { value: "Femenino", label: "Femenino" },
  { value: "Otros", label: "Otros" },
] as const

interface EditUserFormProps {
  user: UserProfileData
  onClose: () => void
}

export function EditUserForm({ user, onClose }: EditUserFormProps) {
  const [error, setError] = useState<string>()
  const [isPending, startTransition] = useTransition()

  const form = useForm<UserProfileValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender as "Masculino" | "Femenino" | "Otros",
      birthday: user.birthday,
    },
  })

  async function onSubmit(values: UserProfileValues) {
    setError(undefined)
    startTransition(async () => {
      // Here you would typically send the updated data to your backend
      console.log('Updated user data:', values)
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // If there's an error, you can set it like this:
      // setError("An error occurred while updating the profile")
      onClose()
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Editar Perfil</h2>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4 flex-grow overflow-y-auto px-2">
          {error && <ErrorText errorText={error} />}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Apellido" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3 col-span-full">
                  <FormLabel>Género</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-3 gap-2"
                    >
                      {GENDER_OPTIONS.map((option) => (
                        <FormItem key={option.value} className="flex items-center space-x-2 space-y-0 ring-1 p-2 ring-primary rounded-lg">
                          <FormControl>
                            <RadioGroupItem value={option.value} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de nacimiento</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="pt-6">
          <LoadingButton loading={isPending} type="submit" className="w-full">
            Guardar Cambios
          </LoadingButton>
        </div>
      </form>
    </Form>
  )
}
