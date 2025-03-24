"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import { Form } from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import LoadingButton from "@/components/LoadingButton"
import ErrorText from "@/components/ErrorText"
import { facilitySchema, type FacilityValues } from "@/lib/validation"
import { useFacilityMutation, useUpdateFacilityMutation } from "@/app/(main)/(authenticated)/(admin)/establecimientos/mutations"
import noLogoImage from '@/assets/no-image.png'
import { GeneralInfoTabForm } from "./GeneralInfoTabForm"
import { CustomizationTabForm } from "./CustomizationTabForm"

interface FacilityFormProps {
  userId: string
  facilityData?: FacilityValues & { id: string }
}

export default function FacilityForm({ userId, facilityData }: FacilityFormProps) {
  const [error, setError] = useState<string>()
  const router = useRouter()
  const isEditing = !!facilityData

  const { mutate: createFacility, isPending: isCreating, error: createError } = useFacilityMutation(userId)
  const { mutate: updateFacility, isPending: isUpdating, error: updateError } = useUpdateFacilityMutation()

  const [croppedLogo, setCroppedLogo] = useState<Blob | null>(null)
  const [webLogoFile, setWebLogoFile] = useState<File | null>(null)

  const form = useForm<FacilityValues>({
    resolver: zodResolver(facilitySchema),
    defaultValues: facilityData || {
      name: "",
      description: "",
      email: "",
      address: "",
      phone: "",
      instagram: "",
      facebook: "",
      metadata: {
        title: "",
        slogan: "",
        primaryColor: "",
        secondaryColor: "",
        thirdColor: "",
      },
    },
  })

  useEffect(() => {
    if (facilityData) {
      form.reset(facilityData)
    }
  }, [facilityData, form])

  async function onSubmit(values: FacilityValues) {
    setError(undefined)
    const newLogoFile = croppedLogo
      ? new File([croppedLogo], `logo_${Date.now()}.webp`, { type: 'image/webp' })
      : undefined
    const newWebLogoFile = webLogoFile || undefined

    if (isEditing && facilityData) {
      updateFacility(
        {
          id: facilityData.id,
          values,
          logo: newLogoFile,
          webLogo: newWebLogoFile
        },
        {
          onSuccess: () => {
            setCroppedLogo(null)
            setWebLogoFile(null)
            form.reset()
            router.push('/establecimientos')
          },
        }
      )
    } else {
      createFacility(
        {
          values,
          logo: newLogoFile,
          webLogo: newWebLogoFile
        },
        {
          onSuccess: () => {
            setCroppedLogo(null)
            setWebLogoFile(null)
            form.reset()
            router.push('/establecimientos')
          },
        }
      )
    }
  }

  const mutationError = isEditing ? updateError : createError
  const isPending = isEditing ? isUpdating : isCreating

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Editar establecimiento" : "Agregar establecimiento"}</CardTitle>
        <CardDescription>
          {isEditing ? "Modifica los datos de tu establecimiento" : "Ingresa los datos de tu establecimiento para comenzar"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {(mutationError || error) && (
              <ErrorText
                errorText={
                  (mutationError instanceof Error
                    ? mutationError.message
                    : typeof mutationError === 'string'
                      ? mutationError
                      : null) ||
                  error ||
                  'An error occurred'
                }
              />
            )}

            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">Información General</TabsTrigger>
                <TabsTrigger value="customization">Personalización</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <GeneralInfoTabForm
                  control={form.control}
                  croppedLogo={croppedLogo}
                  setCroppedLogo={setCroppedLogo}
                  noLogoImage={facilityData?.logoUrl || noLogoImage}
                />
              </TabsContent>
              <TabsContent value="customization">
                <CustomizationTabForm
                  control={form.control}
                  webLogoFile={webLogoFile}
                  setWebLogoFile={setWebLogoFile}
                  noLogoImage={facilityData?.metadata?.logoWebUrl || noLogoImage}
                />
              </TabsContent>
            </Tabs>
            <LoadingButton
              loading={isPending}
              type="submit"
              className="w-full"
            >
              {isEditing ? "Actualizar establecimiento" : "Crear establecimiento"}
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

