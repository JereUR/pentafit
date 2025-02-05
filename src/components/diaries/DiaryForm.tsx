'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import {
  Form
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
import LoadingButton from "@/components/LoadingButton"
import ErrorText from "@/components/ErrorText"
import { diarySchema, type DiaryValues } from "@/lib/validation"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import NoWorkingFacilityMessage from "../NoWorkingFacilityMessage"
import WorkingFacility from "../WorkingFacility"
import { typeSchedule, genreExclusive } from "@prisma/client"
import { useCreateDiaryMutation, useUpdateDiaryMutation } from "@/app/(main)/(authenticated)/agenda/mutations"
import { GeneralInfoTabDiaryForm } from "./GeneralInfoTabDiaryForm"
import { ScheduleTabDiaryForm } from "./ScheduleTabDiaryForm"

interface DiaryFormProps {
  userId: string
  diaryData?: DiaryValues & { id: string }
}

export default function DiaryForm({ userId, diaryData }: DiaryFormProps) {
  const { workingFacility } = useWorkingFacility()
  const [error, setError] = useState<string>()
  const isEditing = !!diaryData
  const router = useRouter()

  const { mutate: createDiary, isPending: isCreating, error: createError } = useCreateDiaryMutation()
  const { mutate: updateDiary, isPending: isUpdating, error: updateError } = useUpdateDiaryMutation()

  const form = useForm<DiaryValues>({
    resolver: zodResolver(diarySchema),
    defaultValues: diaryData || {
      name: "",
      facilityId: workingFacility?.id || "",
      activityId: "",
      typeSchedule: typeSchedule.TURNOS,
      dateFrom: new Date(),
      dateUntil: new Date(),
      repeatFor: null,
      offerDays: Array(7).fill({
        isOffer: false,
        discountPercentage: 0
      }),
      termDuration: 60,
      amountOfPeople: 1,
      isActive: false,
      genreExclusive: genreExclusive.NO,
      worksHolidays: false,
      observations: "",
      daysAvailable: Array(7).fill({
        dayOfWeek: 0,
        available: false,
        timeStart: "08:00",
        timeEnd: "09:00"
      })
    },
  })

  useEffect(() => {
    if (diaryData) {
      form.reset(diaryData)
    }

    if (workingFacility) {
      form.setValue("facilityId", workingFacility.id)
    }
  }, [diaryData, form, workingFacility])

  async function onSubmit(values: DiaryValues) {
    setError(undefined)

    if (isEditing && diaryData) {
      updateDiary(
        {
          id: diaryData.id,
          values,
        },
        {
          onSuccess: () => {
            form.reset()
            router.push("/agenda")
          },
          onError: (error) => {
            setError(error instanceof Error ? error.message : "Error updating diary")
          },
        },
      )
    } else {
      createDiary(values, {
        onSuccess: () => {
          form.reset()
          router.push("/agenda")
        },
        onError: (error) => {
          setError(error instanceof Error ? error.message : "Error creating diary")
        },
      })
    }
  }

  console.log(form.formState.errors)

  const mutationError = isEditing ? updateError : createError
  const isPending = isEditing ? isUpdating : isCreating
  const pageTitle = isEditing ? "Editar agenda" : "Agregar agenda"
  const pageDescription = isEditing
    ? "Modifica los datos de tu agenda"
    : "Ingresa los datos de tu agenda para comenzar"

  if (!workingFacility) {
    return <div className='flex flex-col items-center gap-5 p-5 md:p-10 rounded-md border'>
      <WorkingFacility userId={userId} />
      <NoWorkingFacilityMessage entityName="una agenda" />
    </div>
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
                  <TabsTrigger value="schedule">Horarios</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                  <GeneralInfoTabDiaryForm control={form.control} />
                </TabsContent>
                <TabsContent value="schedule">
                  <ScheduleTabDiaryForm control={form.control} />
                </TabsContent>
              </Tabs>
              <LoadingButton
                loading={isPending}
                type="submit"
                className="w-full"
              >
                {isEditing ? "Actualizar agenda" : "Crear agenda"}
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
