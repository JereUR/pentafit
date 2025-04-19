'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ClientUserProfileData, UserData } from '@/types/user'
import LoadingButton from '@/components/LoadingButton'
import { updateUserProfileSchema, UpdateUserProfileValues } from '@/lib/validation'
import { useUpdateProfileMutation } from './mutations'
import avatarPlaceholder from '@/assets/avatar-placeholder.png'
import { AvatarInput } from '@/components/AvatarInput'

const GENDER_OPTIONS = [
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Femenino', label: 'Femenino' },
  { value: 'Otros', label: 'Otros' },
] as const

interface EditUserFormProps {
  user: UserData | ClientUserProfileData
  onClose: () => void
  primaryColor?: string
}

export function EditUserForm({ user, onClose, primaryColor }: EditUserFormProps) {
  const form = useForm<UpdateUserProfileValues>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender as 'Masculino' | 'Femenino' | 'Otros',
      birthday: user.birthday,
    },
  })

  const mutation = useUpdateProfileMutation()

  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null)

  async function onSubmit(values: UpdateUserProfileValues) {
    const newAvatarFile = croppedAvatar
      ? new File([croppedAvatar], `avatar_${user.id}.webp`, { type: 'image/webp' })
      : undefined

    mutation.mutate(
      {
        values,
        avatar: newAvatarFile,
      },
      {
        onSuccess: () => {
          setCroppedAvatar(null)
          onClose()
        },
      },
    )
  }

  console.log('primaryColor:', primaryColor)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Editar Perfil</h2>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-1.5">
          <FormLabel>Avatar</FormLabel>
          <AvatarInput
            src={
              croppedAvatar
                ? URL.createObjectURL(croppedAvatar)
                : user.avatarUrl || avatarPlaceholder
            }
            onImageCropped={setCroppedAvatar}
          />
        </div>
        <div className="space-y-4 flex-grow overflow-y-auto px-2">
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
                        <FormItem
                          key={option.value}
                          className="flex items-center space-x-2 space-y-0 p-2 rounded-lg border"
                          style={{
                            borderColor: primaryColor || '#F97015',
                          }}
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={option.value}
                              className="custom-radio"
                              style={{
                                '--radio-border-color': primaryColor || '#F97015',
                              } as React.CSSProperties}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{option.label}</FormLabel>
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
          <LoadingButton
            loading={mutation.isPending}
            type="submit"
            className="w-full"
            style={{ backgroundColor: primaryColor }}
          >
            Guardar Cambios
          </LoadingButton>
        </div>
      </form>
    </Form>
  )
}