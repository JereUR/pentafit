import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { planSchema } from "@/lib/validation"
import { z } from "zod"
import { createNotification } from "@/lib/notificationHelpers"
import { validateRequest } from "@/auth"
import { NotificationType } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function POST(req: Request) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")
  const body = await req.json()

  try {
    const validatedData = planSchema.parse(body)
    let newPlan

    await prisma.$transaction(async (tx) => {
      newPlan = await tx.plan.create({
        data: {
          ...validatedData,
          startDate: new Date(validatedData.startDate),
          endDate: new Date(validatedData.endDate),
          diaryPlans: {
            create: validatedData.diaryPlans.map((diaryPlan) => ({
              name: diaryPlan.name,
              daysOfWeek: diaryPlan.daysOfWeek,
              sessionsPerWeek: diaryPlan.sessionsPerWeek,
              activity: {
                connect: { id: diaryPlan.activityId },
              },
            })),
          },
        },
      })

      await createNotification(
        tx,
        user.id,
        validatedData.facilityId,
        NotificationType.PLAN_CREATED,
        newPlan.id,
      )
    })

    revalidatePath(`/planes`)

    return NextResponse.json(newPlan, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      )
    }
    console.error("Server error:", error)
    return NextResponse.json(
      { message: "Error al crear el plan" },
      { status: 500 },
    )
  }
}

export async function PUT(req: Request) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  const body = await req.json()
  const { id, ...updateData } = body

  try {
    const validatedData = planSchema.parse(updateData)
    let updatedPlan

    await prisma.$transaction(async (tx) => {
      // First, delete existing diaryPlans
      await tx.diaryPlan.deleteMany({
        where: { planId: id },
      })

      // Then, update the plan and create new diaryPlans
      updatedPlan = await tx.plan.update({
        where: { id },
        data: {
          name: validatedData.name,
          description: validatedData.description,
          price: validatedData.price,
          startDate: new Date(validatedData.startDate),
          endDate: new Date(validatedData.endDate),
          expirationPeriod: validatedData.expirationPeriod,
          generateInvoice: validatedData.generateInvoice,
          paymentTypes: validatedData.paymentTypes,
          planType: validatedData.planType,
          freeTest: validatedData.freeTest,
          current: validatedData.current,
          facilityId: validatedData.facilityId,
          diaryPlans: {
            create: validatedData.diaryPlans.map((diaryPlan) => ({
              name: diaryPlan.name,
              daysOfWeek: diaryPlan.daysOfWeek,
              sessionsPerWeek: diaryPlan.sessionsPerWeek,
              activity: {
                connect: { id: diaryPlan.activityId },
              },
            })),
          },
        },
      })

      await createNotification(tx, user.id, validatedData.facilityId, NotificationType.PLAN_UPDATED, updatedPlan.id)
    })

    revalidatePath(`/planes`)

    return NextResponse.json({ success: true, plan: updatedPlan }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Error de validación", errors: error.errors }, { status: 400 })
    }
    console.error("Server error:", error)
    return NextResponse.json(
      { message: "Error al actualizar el plan", error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
