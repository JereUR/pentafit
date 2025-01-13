"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import LoadingButton from "@/components/LoadingButton"
import ErrorText from "@/components/ErrorText"
import { facilitySchema, type FacilityValues } from "@/lib/validation"
import { useFacilityMutation } from "@/app/(main)/(authenticated)/establecimientos/mutations"
import noLogoImage from '@/assets/no-image.png'
import { AvatarInput } from "../AvatarInput"

interface FacilityFormProps {
  userId: string
}

export default function FacilityForm({ userId }: FacilityFormProps) {
  const [error, setError] = useState<string>()
  const { mutate, isPending, error: mutationError } = useFacilityMutation(userId)

  const [croppedLogo, setCroppedLogo] = useState<Blob | null>(null)
  const [croppedWebLogo, setCroppedWebLogo] = useState<Blob | null>(null)

  const form = useForm<FacilityValues>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
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

  async function onSubmit(values: FacilityValues) {
    setError(undefined)
    const newLogoFile = croppedLogo
      ? new File([croppedLogo], `logo_${Date.now()}.webp`, { type: 'image/webp' })
      : undefined
    const newWebLogoFile = croppedWebLogo
      ? new File([croppedWebLogo], `web_logo_${Date.now()}.webp`, { type: 'image/webp' })
      : undefined

    mutate(
      {
        values,
        logo: newLogoFile,
        webLogo: newWebLogoFile,
      },
      {
        onSuccess: () => {
          setCroppedLogo(null)
          setCroppedWebLogo(null)
          form.reset()
        },
      },
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Agregar establecimiento</CardTitle>
        <CardDescription>
          Ingresa los datos de tu establecimiento para comenzar
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
              <TabsContent value="general" className="space-y-6">
                <div className="space-y-4">
                  <FormLabel>Logo</FormLabel>
                  <AvatarInput
                    src={croppedLogo ? URL.createObjectURL(croppedLogo) : noLogoImage.src}
                    onImageCropped={setCroppedLogo}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Mi establecimiento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@ejemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe tu establecimiento..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="+1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Input placeholder="Calle ejemplo 123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input placeholder="@usuario" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input placeholder="usuario.facebook" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              <TabsContent value="customization" className="space-y-6">
                <div className="space-y-4">
                  <FormLabel>Logo Web</FormLabel>
                  <AvatarInput
                    src={croppedWebLogo ? URL.createObjectURL(croppedWebLogo) : noLogoImage.src}
                    onImageCropped={setCroppedWebLogo}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="metadata.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Título personalizado" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="metadata.slogan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slogan</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu slogan aquí" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="metadata.primaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color primario</FormLabel>
                        <FormControl>
                          <Input type="color" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="metadata.secondaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color secundario</FormLabel>
                        <FormControl>
                          <Input type="color" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="metadata.thirdColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color terciario</FormLabel>
                        <FormControl>
                          <Input type="color" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
            <LoadingButton
              loading={isPending}
              type="submit"
              className="w-full"
            >
              Crear establecimiento
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

