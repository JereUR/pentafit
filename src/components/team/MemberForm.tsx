"use client"

import { useEffect, useState } from "react"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { memberSchema, type MemberValues } from "@/lib/validation"
import { useCreateMemberMutation, useUpdateMemberMutation } from "@/app/(main)/(authenticated)/equipo/mutations"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import WorkingFacility from "../WorkingFacility"
import NoWorkingFacilityMessage from "../NoWorkingFacilityMessage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Form } from "../ui/form"
import ErrorText from "../ErrorText"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import LoadingButton from "../LoadingButton"
import GeneralInfoTabMemberForm from "./GeneralInfoTabMemberForm"
import { DetailsTabMemberForm } from "./DetailsTabMemberForm"

interface MemberFormProps {
  userId: string
  memberData?: MemberValues & { id: string } & { avatarUrl?: string }
}

export default function MemberForm({ userId, memberData }: MemberFormProps) {
  const { workingFacility } = useWorkingFacility()
  const [error, setError] = useState<string>()
  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null)
  const isEditing = !!memberData

  const { mutate: createMember, isPending: isCreating, error: createError } = useCreateMemberMutation()
  const { mutate: updateMember, isPending: isUpdating, error: updateError } = useUpdateMemberMutation()

  const form = useForm<MemberValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: memberData || {
      firstName: "",
      lastName: "",
      email: "",
      gender: "",
      birthday: "",
      role: "STAFF",
      avatarUrl: null,
      password: "",
      confirmPassword: "",
      facilities: [],
    },
  })

  useEffect(() => {
    if (memberData) {
      form.reset(memberData)
    }
  }, [memberData, form])

  async function onSubmit(values: MemberValues) {
    const newAvatarFile = croppedAvatar
      ? new File([croppedAvatar], `avatar_${userId}.webp`, { type: "image/webp" })
      : undefined
    setError(undefined)

    if (isEditing && memberData) {
      updateMember(
        {
          id: memberData.id,
          values,
          avatar: newAvatarFile,
        },
        {
          onSuccess: () => {
            setCroppedAvatar(null)
            form.reset()
          },
        },
      )
    } else {
      createMember(
        {
          ...values,
        },
        {
          onSuccess: () => {
            setCroppedAvatar(null)
            form.reset()
          },
        },
      )
    }
  }

  const mutationError = isEditing ? updateError : createError
  const isPending = isEditing ? isUpdating : isCreating
  const pageTitle = isEditing ? "Editar integrante" : "Agregar integrante"
  const pageDescription = isEditing
    ? "Modifica los datos del integrante"
    : "Ingresa los datos del integrante para comenzar"

  if (!workingFacility) {
    return (
      <div className="flex flex-col items-center gap-5 p-5 md:p-10 rounded-md border">
        <WorkingFacility userId={userId} />
        <NoWorkingFacilityMessage entityName="un integrante" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center md:items-start gap-5 p-5 md:p-10 md:py-14 rounded-md border">
      {!isEditing && <WorkingFacility userId={userId} />}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{pageTitle}</CardTitle>
          <CardDescription>{pageDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {(mutationError || error) && (
                <ErrorText
                  errorText={
                    (mutationError instanceof Error
                      ? mutationError.message
                      : typeof mutationError === "string"
                        ? mutationError
                        : null) ||
                    error ||
                    "An error occurred"
                  }
                />
              )}
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  {window.innerWidth > 700 ? (
                    <TabsTrigger value="general">Información General</TabsTrigger>
                  ) : (
                    <TabsTrigger value="general">Inf General</TabsTrigger>
                  )}
                  <TabsTrigger value="details">Detalles</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                  <GeneralInfoTabMemberForm
                    control={form.control}
                    croppedAvatar={croppedAvatar}
                    setCroppedAvatar={setCroppedAvatar}
                    memberAvatarUrl={form.getValues("avatarUrl")}
                  />
                </TabsContent>
                <TabsContent value="details">
                  <DetailsTabMemberForm control={form.control} userId={userId} />
                </TabsContent>
              </Tabs>
              <LoadingButton loading={isPending} type="submit" className="w-full">
                {isEditing ? "Actualizar integrante" : "Crear integrante"}
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

