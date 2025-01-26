import { Control } from "react-hook-form"

import { MemberValues, UpdateMemberValues } from "@/lib/validation"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { GENDER_OPTIONS } from "@/types/user"
import { AvatarInput } from "../AvatarInput"
import avatarPlaceholder from "@/assets/avatar-placeholder.png"

interface GeneralInfoTabActivityFormProps {
  control: Control<MemberValues | UpdateMemberValues>
  croppedAvatar: Blob | null
  setCroppedAvatar: (avatar: Blob | null) => void
  memberAvatarUrl: string | null
}

export default function GeneralInfoTabMemberForm({ control, croppedAvatar, setCroppedAvatar, memberAvatarUrl }: GeneralInfoTabActivityFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <FormLabel>Avatar</FormLabel>
        <AvatarInput
          src={
            croppedAvatar
              ? URL.createObjectURL(croppedAvatar)
              : memberAvatarUrl || avatarPlaceholder
          }
          onImageCropped={setCroppedAvatar}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del integrante" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido</FormLabel>
              <FormControl>
                <Input placeholder="Apellido del integrante" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email del integrante" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
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
      <FormField
        control={control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Género</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 lg:grid-cols-3 gap-2"
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
    </div>
  )
}
