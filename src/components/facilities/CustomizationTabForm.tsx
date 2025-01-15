import Image from 'next/image'
import { StaticImageData } from "next/image"
import { Control } from "react-hook-form"

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FacilityValues } from "@/lib/validation"


interface CustomizationTabProps {
  control: Control<FacilityValues>
  webLogoFile: File | null
  setWebLogoFile: (file: File | null) => void
  noLogoImage: string | StaticImageData
}

export function CustomizationTabForm({ control, webLogoFile, setWebLogoFile, noLogoImage }: CustomizationTabProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormLabel>Logo Web</FormLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="relative w-full aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
            <Image
              src={webLogoFile ? URL.createObjectURL(webLogoFile) : noLogoImage}
              alt="Logo web"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="web-logo-upload"
              className="flex items-center justify-center px-4 py-2 border border-primary bg-background text-sm font-medium rounded-md cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <span>Seleccionar archivo</span>
              <input
                id="web-logo-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setWebLogoFile(file)
                  }
                }}
                className="sr-only"
              />
            </label>
            {webLogoFile ? (
              <p className="text-sm text-muted-foreground">
                Archivo seleccionado: {webLogoFile.name}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No se ha seleccionado ningún archivo
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
    </div>
  )
}

