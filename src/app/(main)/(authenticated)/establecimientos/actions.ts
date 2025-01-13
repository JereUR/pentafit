"use server"

import { revalidatePath } from "next/cache"
import { FacilityValues } from "@/lib/validation"
import prisma from "@/lib/prisma"

export async function createFacility(userId: string, values: FacilityValues) {
  try {
    const facility = await prisma.facility.create({
      data: {
        name: values.name,
        description: values.description,
        email: values.email,
        address: values.address,
        phone: values.phone,
        instagram: values.instagram,
        facebook: values.facebook,
        logoUrl: values.logoUrl,
        metadata: {
          create: {
            title: values.metadata?.title,
            slogan: values.metadata?.slogan,
            primaryColor: values.metadata?.primaryColor,
            secondaryColor: values.metadata?.secondaryColor,
            thirdColor: values.metadata?.thirdColor,
            logoWebUrl: values.metadata?.logoWebUrl,
          },
        },
        users: {
          create: {
            userId: userId,
          },
        },
      },
    })

    revalidatePath("/establecimientos")
    return { success: true, facility }
  } catch (error) {
    console.error(error)
    return { error: "Error al crear el establecimiento" }
  }
}
